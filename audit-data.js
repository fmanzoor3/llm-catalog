// Comprehensive audit of all data displayed to users
const fs = require('fs');
const modelData = JSON.parse(fs.readFileSync('data/models.json', 'utf8'));

let errors = [];
let warnings = [];

function err(msg) { errors.push('ERROR: ' + msg); }
function warn(msg) { warnings.push('WARN: ' + msg); }

// Build model lookup
const modelMap = {};
modelData.models.forEach(m => { modelMap[m.id] = m; });

console.log('=== DATA CONSISTENCY AUDIT ===\n');

// 1. Check all model IDs referenced in useCases exist
console.log('--- 1. Checking useCase model references ---');
Object.entries(modelData.useCases).forEach(([ucKey, uc]) => {
    Object.entries(uc.recommendations).forEach(([prioKey, prio]) => {
        // Check topPick exists
        if (!modelMap[prio.topPick]) {
            err(`useCases.${ucKey}.${prioKey}.topPick="${prio.topPick}" - model not found`);
        }
        // Check topPick is in the models list
        const topInList = prio.models.some(m => (typeof m === 'string' ? m : m.id) === prio.topPick);
        if (!topInList) {
            err(`useCases.${ucKey}.${prioKey}.topPick="${prio.topPick}" not in models list`);
        }
        // Check each model exists
        prio.models.forEach((modelRec, idx) => {
            const id = typeof modelRec === 'string' ? modelRec : modelRec.id;
            if (!modelMap[id]) {
                err(`useCases.${ucKey}.${prioKey}.models[${idx}]="${id}" - model not found`);
            }
        });
    });
});

// 2. Check quickDecisions model references
console.log('--- 2. Checking quickDecisions model references ---');
modelData.quickDecisions.forEach((qd, idx) => {
    qd.recommendations.forEach((id, ridx) => {
        if (!modelMap[id]) {
            err(`quickDecisions[${idx}].recommendations[${ridx}]="${id}" - model not found`);
        }
    });
});

// 3. Verify reason text matches actual model data
console.log('--- 3. Cross-checking reason text against model specs ---');
Object.entries(modelData.useCases).forEach(([ucKey, uc]) => {
    Object.entries(uc.recommendations).forEach(([prioKey, prio]) => {
        prio.models.forEach((modelRec) => {
            if (typeof modelRec === 'string') return;
            const model = modelMap[modelRec.id];
            if (!model) return;
            const reason = modelRec.reason;

            // Check for specific numerical claims in reasons
            const sweMatch = reason.match(/(\d+\.?\d*)%\s*SWE-bench/i);
            if (sweMatch) {
                const claimed = parseFloat(sweMatch[1]);
                const actual = model.benchmarks?.sweBenchVerified || model.benchmarks?.sweBenchPro;
                if (actual && Math.abs(claimed - actual) > 1) {
                    err(`${ucKey}.${prioKey} ${modelRec.id}: reason says ${claimed}% SWE-bench but model has ${actual}%`);
                }
            }

            const aimeMatch = reason.match(/(\d+\.?\d*)%\s*AIME/i);
            if (aimeMatch) {
                const claimed = parseFloat(aimeMatch[1]);
                const actual = model.benchmarks?.aime2024;
                if (actual && Math.abs(claimed - actual) > 2) {
                    err(`${ucKey}.${prioKey} ${modelRec.id}: reason says ${claimed}% AIME but model has ${actual}%`);
                }
            }

            const contextMatch = reason.match(/(\d+)([KMB])\s*(?:token\s*)?context/i);
            if (contextMatch) {
                const num = parseInt(contextMatch[1]);
                const unit = contextMatch[2].toUpperCase();
                let claimed = num;
                if (unit === 'K') claimed *= 1000;
                if (unit === 'M') claimed *= 1000000;
                if (unit === 'B') claimed *= 1000000000;
                // Also compute binary interpretation (128K = 128*1024 = 131072)
                let claimedBinary = num;
                if (unit === 'K') claimedBinary *= 1024;
                if (unit === 'M') claimedBinary *= 1048576;
                const actual = model.contextWindow;
                if (actual && claimed !== actual && claimedBinary !== actual) {
                    err(`${ucKey}.${prioKey} ${modelRec.id}: reason says ${num}${unit} context but model has ${actual}`);
                }
            }

            // Check cost-tier alignment with priority
            if (prioKey === 'cost' && (model.costTier === 'high')) {
                warn(`${ucKey}.cost recommends ${modelRec.id} which is costTier="high"`);
            }
            if (prioKey === 'privacy' && model.costTier !== 'self-hosted' && model.provider !== 'opensource') {
                // Not necessarily wrong but worth noting
            }
        });
    });
});

// 4. Check provider strengths text
console.log('--- 4. Checking provider descriptions ---');
Object.entries(modelData.providers).forEach(([key, prov]) => {
    prov.strengths.forEach((s, idx) => {
        // Check for specific score claims
        const sweMatch = s.match(/(\d+\.?\d*)%\s*SWE-bench/i);
        if (sweMatch) {
            const claimed = parseFloat(sweMatch[1]);
            // Find the model this refers to
            const provModels = modelData.models.filter(m => m.provider === key);
            const hasMatch = provModels.some(m => {
                const swe = m.benchmarks?.sweBenchVerified || m.benchmarks?.sweBenchPro;
                return swe && Math.abs(swe - claimed) <= 0.5;
            });
            if (!hasMatch) {
                err(`providers.${key}.strengths[${idx}]: claims ${claimed}% SWE-bench but no model matches`);
            }
        }

        const aimeMatch = s.match(/(\d+\.?\d*)%?\s*AIME/i);
        if (aimeMatch) {
            const claimed = parseFloat(aimeMatch[1]);
            const provModels = modelData.models.filter(m => m.provider === key);
            const hasMatch = provModels.some(m => {
                const aime = m.benchmarks?.aime2024;
                return aime && Math.abs(aime - claimed) <= 2;
            });
            if (!hasMatch) {
                err(`providers.${key}.strengths[${idx}]: claims ${claimed}% AIME but no model matches`);
            }
        }
    });
});

// 5. Check model description vs actual specs
console.log('--- 5. Checking model descriptions ---');
modelData.models.forEach(m => {
    const desc = m.description;

    // Check SWE-bench in description
    const sweMatch = desc.match(/(\d+\.?\d*)%\s*SWE-bench/i);
    if (sweMatch) {
        const claimed = parseFloat(sweMatch[1]);
        const actual = m.benchmarks?.sweBenchVerified;
        if (actual && Math.abs(claimed - actual) > 0.5) {
            err(`${m.id} description: claims ${claimed}% SWE-bench but benchmarks say ${actual}%`);
        }
    }

    const aimeMatch = desc.match(/(\d+\.?\d*)%\s*AIME/i);
    if (aimeMatch) {
        const claimed = parseFloat(aimeMatch[1]);
        const actual = m.benchmarks?.aime2024;
        if (actual && Math.abs(claimed - actual) > 1) {
            err(`${m.id} description: claims ${claimed}% AIME but benchmarks say ${actual}%`);
        }
    }

    // Check context window claims in strengths
    m.strengths?.forEach((s, idx) => {
        const ctxMatch = s.match(/(\d+)([KMB])\s*(?:token\s*)?context/i);
        if (ctxMatch) {
            const num = parseInt(ctxMatch[1]);
            const unit = ctxMatch[2].toUpperCase();
            let claimed = num;
            if (unit === 'K') claimed *= 1000;
            if (unit === 'M') claimed *= 1000000;
            // Also compute binary interpretation (128K = 128*1024 = 131072)
            let claimedBinary = num;
            if (unit === 'K') claimedBinary *= 1024;
            if (unit === 'M') claimedBinary *= 1048576;
            if (claimed !== m.contextWindow && claimedBinary !== m.contextWindow) {
                err(`${m.id} strengths[${idx}]: claims ${num}${unit} context but contextWindow=${m.contextWindow}`);
            }
        }

        const sweS = s.match(/(\d+\.?\d*)%\s*(?:on\s*)?SWE-bench/i);
        if (sweS) {
            const claimed = parseFloat(sweS[1]);
            const actual = m.benchmarks?.sweBenchVerified;
            if (actual && Math.abs(claimed - actual) > 0.5) {
                err(`${m.id} strengths[${idx}]: claims ${claimed}% SWE-bench but benchmarks say ${actual}%`);
            }
        }

        const aimeS = s.match(/(\d+\.?\d*)%\s*(?:on\s*)?AIME/i);
        if (aimeS) {
            const claimed = parseFloat(aimeS[1]);
            const actual = m.benchmarks?.aime2024;
            if (actual && Math.abs(claimed - actual) > 1) {
                err(`${m.id} strengths[${idx}]: claims ${claimed}% AIME but benchmarks say ${actual}%`);
            }
        }
    });

    // Check weaknesses for stale pricing
    m.weaknesses?.forEach((w, idx) => {
        const priceMatch = w.match(/\$(\d+)\/\$(\d+)\s*per\s*M/i);
        if (priceMatch && m.pricing) {
            const claimedIn = parseFloat(priceMatch[1]);
            const claimedOut = parseFloat(priceMatch[2]);
            if (Math.abs(claimedIn - m.pricing.inputPerMillion) > 0.5 || Math.abs(claimedOut - m.pricing.outputPerMillion) > 0.5) {
                err(`${m.id} weaknesses[${idx}]: claims $${claimedIn}/$${claimedOut} but pricing is $${m.pricing.inputPerMillion}/$${m.pricing.outputPerMillion}`);
            }
        }
    });

    // Check overview text
    if (m.overview) {
        const oSwe = m.overview.match(/(\d+\.?\d*)%\s*(?:on\s*)?SWE-bench/i);
        if (oSwe) {
            const claimed = parseFloat(oSwe[1]);
            const actual = m.benchmarks?.sweBenchVerified;
            if (actual && Math.abs(claimed - actual) > 0.5) {
                err(`${m.id} overview: claims ${claimed}% SWE-bench but benchmarks say ${actual}%`);
            }
        }
        const oAime = m.overview.match(/(\d+\.?\d*)%\s*(?:on\s*)?AIME/i);
        if (oAime) {
            const claimed = parseFloat(oAime[1]);
            const actual = m.benchmarks?.aime2024;
            if (actual && Math.abs(claimed - actual) > 1) {
                err(`${m.id} overview: claims ${claimed}% AIME but benchmarks say ${actual}%`);
            }
        }
    }
});

// 6. Check Llama 4 Maverick context window - was claimed as 400K in some reasons
console.log('--- 6. Spot-checking known problem areas ---');
const maverick = modelMap['llama-4-maverick'];
if (maverick) {
    // Check all reasons mentioning Maverick context
    Object.entries(modelData.useCases).forEach(([ucKey, uc]) => {
        Object.entries(uc.recommendations).forEach(([prioKey, prio]) => {
            prio.models.forEach((modelRec) => {
                if (typeof modelRec === 'string') return;
                if (modelRec.id === 'llama-4-maverick') {
                    if (modelRec.reason.includes('400K')) {
                        err(`${ucKey}.${prioKey} maverick: reason says 400K but contextWindow=${maverick.contextWindow} (${maverick.contextWindow/1000000}M)`);
                    }
                }
            });
        });
    });
}

// 7. Check DeepSeek R1 useCaseDetails for "near-perfect AIME"
const r1 = modelMap['deepseek-r1'];
if (r1) {
    r1.useCaseDetails?.forEach((ucd, idx) => {
        if (ucd.explanation.toLowerCase().includes('near-perfect') && r1.benchmarks?.aime2024 < 90) {
            err(`deepseek-r1 useCaseDetails[${idx}]: says "near-perfect AIME" but score is ${r1.benchmarks.aime2024}%`);
        }
    });
}

// Print results
console.log('\n=============================');
console.log('ERRORS FOUND:', errors.length);
console.log('WARNINGS:', warnings.length);
console.log('=============================\n');

errors.forEach(e => console.log('  ' + e));
if (warnings.length) {
    console.log('\n--- Warnings ---');
    warnings.forEach(w => console.log('  ' + w));
}

if (errors.length === 0) {
    console.log('\n  All checks passed!');
}
