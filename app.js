/* ============================================
   LLM Catalog — Application Logic
   Shared utilities + page-specific logic
   ============================================ */

// ===== THEME & LANGUAGE INIT (runs before DOMContentLoaded to avoid FOUC) =====
(function() {
    // Theme already set by inline <script> in <head>, but wire up toggle here
    var savedLang = localStorage.getItem('lang') || 'en';
    document.documentElement.setAttribute('data-lang', savedLang);
})();

// ===== HELPERS =====
function getModelById(id) { return modelData.models.find(m => m.id === id); }
function getProviderName(providerId) { return modelData.providers[providerId]?.displayName || providerId; }

// Localized model/provider field getters
function getLang() { return document.documentElement.getAttribute('data-lang') || 'en'; }
function ml(model, field) {
    if (getLang() === 'tr' && model[field + '_tr']) return model[field + '_tr'];
    return model[field];
}
function providerTagline(key) {
    var p = modelData.providers[key];
    if (!p) return '';
    if (getLang() === 'tr' && p.tagline_tr) return p.tagline_tr;
    return p.tagline || '';
}

function formatTokenCount(n) {
    if (n >= 1000000) { var m = n / 1000000; return (Math.round(m * 10) / 10 === Math.round(m) ? Math.round(m) : (Math.round(m * 10) / 10)) + 'M'; }
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
}

function getCostLabel(cost) {
    if (cost === 'self-hosted') return t('cell.selfHosted');
    if (cost === 'low') return '$';
    if (cost === 'mid') return '$$';
    return '$$$';
}

function getProviderClass(providerId) {
    const map = {
        anthropic: 'bg-anthropic', openai: 'bg-openai', google: 'bg-google',
        deepseek: 'bg-deepseek', xai: 'bg-xai', moonshot: 'bg-moonshot',
        meta: 'bg-meta', alibaba: 'bg-alibaba', mistral: 'bg-mistral',
        amazon: 'bg-amazon', xiaomi: 'bg-xiaomi', zhipu: 'bg-zhipu',
        minimax: 'bg-minimax', cohere: 'bg-cohere', microsoft: 'bg-microsoft'
    };
    return map[providerId] || 'bg-default';
}

function getProviderAbbrev(providerId) {
    const map = {
        anthropic: 'ANT', openai: 'OAI', google: 'GDM',
        deepseek: 'DS', xai: 'xAI', moonshot: 'MS',
        meta: 'META', alibaba: 'QWN', mistral: 'MST',
        amazon: 'AMZ', xiaomi: 'XMI', zhipu: 'ZHP',
        minimax: 'MMX', cohere: 'COH', microsoft: 'MSF'
    };
    return map[providerId] || providerId.substring(0, 3).toUpperCase();
}

function getProviderLogo(providerId, size) {
    size = size || 32;
    const s = size;
    // Logos with own background (cover the container)
    var coverLogos = {
        openai: 'logos/openai.jpg',
        anthropic: 'logos/anthropic.jpg',
        xai: 'logos/xai.png',
        moonshot: 'logos/moonshot.jpg'
    };
    // Logos with white/transparent bg (need container bg, use contain+padding)
    var containLogos = {
        google: 'logos/gemini-logo.png',
        deepseek: 'logos/deepseek.png',
        meta: 'logos/llama-ai.png',
        alibaba: 'logos/alibaba.png',
        mistral: 'logos/mistral.png',
        amazon: 'logos/nova-ai.png',
        xiaomi: 'logos/xiaomi.svg',
        zhipu: 'logos/Z.ai_(company_logo).svg.png',
        cohere: 'logos/cohere.png',
        minimax: 'logos/minimax_small.svg',
        microsoft: 'logos/microsoft_small.svg'
    };
    if (coverLogos[providerId]) {
        return '<img src="'+coverLogos[providerId]+'" alt="'+getProviderName(providerId)+'" width="'+s+'" height="'+s+'" class="provider-logo-img">';
    }
    if (containLogos[providerId]) {
        return '<img src="'+containLogos[providerId]+'" alt="'+getProviderName(providerId)+'" width="'+s+'" height="'+s+'" class="provider-logo-img logo-contain">';
    }
    return '<svg viewBox="0 0 32 32" width="'+s+'" height="'+s+'"><text x="16" y="20" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="10" fill="white">'+getProviderAbbrev(providerId)+'</text></svg>';
}

function getBlendedCost(model) {
    if (!model.pricing) return 0;
    return (model.pricing.inputPerMillion + model.pricing.outputPerMillion) / 2;
}

function formatCost(model) {
    if (!model.pricing) return t('cell.selfHosted');
    return '$' + model.pricing.inputPerMillion.toFixed(2) + '/' + model.pricing.outputPerMillion.toFixed(2);
}

function getCostTier(model) {
    if (!model.pricing) return { label: t('cell.selfHosted'), cls: 'cost-self' };
    var blend = (model.pricing.inputPerMillion + model.pricing.outputPerMillion) / 2;
    if (blend < 2) return { label: '$', cls: 'cost-low' };
    if (blend < 10) return { label: '$$', cls: 'cost-mid' };
    return { label: '$$$', cls: 'cost-high' };
}

function getTotalResponseTime(model) {
    var tps = model.outputTokensPerSec;
    if (!tps) return null;
    return (model.ttft || 0) + (100 / tps);
}

function getSpeedTier(model) {
    var totalTime = getTotalResponseTime(model);
    if (totalTime === null) return { label: '—', cls: '' };
    if (totalTime <= 2) return { label: t('cell.fast'), cls: 'speed-fast' };
    if (totalTime <= 5) return { label: t('cell.medium'), cls: 'speed-med' };
    return { label: t('cell.slower'), cls: 'speed-slow' };
}

function formatSpeed(model) {
    var totalTime = getTotalResponseTime(model);
    if (totalTime === null) return '—';
    if (totalTime >= 10) return '~' + Math.round(totalTime) + 's';
    return '~' + totalTime.toFixed(1) + 's';
}

// ===== DEPLOYMENT HELPERS =====
function getHostingLabel(model) {
    var d = model.deployment;
    if (!d) return model.specs?.apiAvailability || t('hosting.api');
    if (d.hostedOnPrem) return t('hosting.onPrem');
    if (d.selfHostable) return t('hosting.selfHostApi');
    return t('hosting.api');
}

function matchesHostingFilter(model, filterValue) {
    if (!filterValue) return true;
    var d = model.deployment;
    if (!d) return filterValue === 'api';
    if (filterValue === 'api') return true; // all models have some API access
    if (filterValue === 'self-hosted') return d.selfHostable;
    if (filterValue === 'on-prem') return d.hostedOnPrem;
    return true;
}

function matchesPlatformFilter(model, platformValue) {
    if (!platformValue) return true;
    var platforms = model.deployment?.cloudPlatforms || [];
    return platforms.indexOf(platformValue) >= 0;
}

function getCloudPlatformLabels(model) {
    var platforms = model.deployment?.cloudPlatforms || [];
    var config = modelData.deploymentConfig?.cloudPlatforms || {};
    return platforms.map(function(p) { return config[p]?.name || p; });
}

// ===== SCORING ENGINE =====
function normalizeMetric(value, min, max) {
    if (value === null || value === undefined) return null;
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function normalizeContextWindow(tokens) {
    if (!tokens) return 0;
    // Log scale: 128K -> ~55, 200K -> ~62, 400K -> ~72, 1M -> ~85, 2M -> ~93, 10M -> ~100
    var logVal = Math.log2(tokens / 1000);
    return Math.max(0, Math.min(100, (logVal - 3) * 8 + 25));
}

function getSpeedProxy(model) {
    var totalTime = getTotalResponseTime(model);
    if (totalTime === null) return null; // missing data should not contribute
    // 0.5s -> ~97, 2s -> ~87, 5s -> ~68, 20s -> ~30, 60s+ -> ~5
    return Math.max(5, Math.min(100, Math.round(100 - totalTime * 1.5)));
}

function getMetricValue(model, metricKey) {
    if (metricKey === 'speedProxy') return getSpeedProxy(model);
    if (metricKey === 'contextWindow') return normalizeContextWindow(model.contextWindow);
    if (metricKey === 'multimodal') return (model.specs && model.specs.multimodal) ? 75 : 15;
    var parts = metricKey.split('.');
    var val = model;
    for (var i = 0; i < parts.length; i++) {
        if (val === null || val === undefined) return null;
        val = val[parts[i]];
    }
    return val !== undefined ? val : null;
}

function computeCapabilityScore(model, useCaseKey) {
    var config = modelData.scoringConfig[useCaseKey];
    if (!config) return { score: 0, breakdown: [], completeness: 0 };
    var weights = config.weights;
    var normRanges = config.normRanges;
    var breakdown = [];
    var totalWeight = 0;
    var availableWeight = 0;

    Object.keys(weights).forEach(function(metric) {
        var raw = getMetricValue(model, metric);
        totalWeight += weights[metric];
        if (raw !== null) availableWeight += weights[metric];
    });

    if (availableWeight === 0) return { score: 0, breakdown: [], completeness: 0 };

    var completeness = availableWeight / totalWeight;

    // Only rescale weights when we have enough data to be meaningful (>=60%)
    // Below 60%: missing metrics contribute 0, naturally lowering the score
    var weightScale = completeness >= 0.6 ? (totalWeight / availableWeight) : 1;
    var score = 0;

    Object.keys(weights).forEach(function(metric) {
        var raw = getMetricValue(model, metric);
        if (raw === null) return;
        var normalized;
        if (metric === 'contextWindow' || metric === 'speedProxy' || metric === 'multimodal') {
            normalized = raw;
        } else if (normRanges && normRanges[metric] && normRanges[metric] !== 'log') {
            normalized = normalizeMetric(raw, normRanges[metric][0], normRanges[metric][1]);
        } else {
            normalized = raw;
        }
        var scaledWeight = weights[metric] * weightScale;
        var contribution = normalized * scaledWeight / 100;
        score += contribution;
        breakdown.push({ metric, raw, normalized: Math.round(normalized), weight: scaledWeight, contribution });
    });

    score = Math.max(0, Math.min(100, score * 100 / totalWeight));
    score = Math.round(score);

    return {
        score,
        breakdown: breakdown.sort((a, b) => b.contribution - a.contribution),
        completeness
    };
}

function computeValueScore(model, capScore) {
    if (model.costTier === 'self-hosted' || !model.pricing) {
        return Math.round(capScore * 0.9);
    }
    var blendedCost = getBlendedCost(model);
    if (blendedCost <= 0) return capScore;
    var rawValue = capScore / (Math.log2(blendedCost + 1) + 0.5);
    return Math.round(Math.max(0, Math.min(100, rawValue * 1.8)));
}

function rankModelsForUseCase(useCaseKey, sortBy) {
    var results = modelData.models.map(function(model) {
        var cap = computeCapabilityScore(model, useCaseKey);
        var val = computeValueScore(model, cap.score);
        return { model, capabilityScore: cap.score, valueScore: val, breakdown: cap.breakdown, completeness: cap.completeness };
    });
    results.forEach(r => { r.overallScore = Math.round(r.capabilityScore * 0.7 + r.valueScore * 0.3); });
    if (sortBy === 'cost') results.sort((a, b) => b.valueScore - a.valueScore);
    else if (sortBy === 'best') results.sort((a, b) => b.overallScore - a.overallScore);
    else results.sort((a, b) => b.capabilityScore - a.capabilityScore);
    return results;
}

function getTopDrivers(breakdown, maxDrivers) {
    maxDrivers = maxDrivers || 3;
    return breakdown.slice(0, maxDrivers).map(function(d) {
        var label = d.metric.replace('benchmarks.', '').replace('arenaElo.', 'Arena ');
        if (label === 'sweBenchVerified') label = 'SWE-bench';
        if (label === 'gpqaDiamond') label = 'GPQA';
        if (label === 'aime2024') label = 'AIME';
        if (label === 'aiderPolyglot') label = 'Aider';
        if (label === 'math500') label = 'MATH500';
        if (label === 'mmmlu') label = 'MMMLU';
        if (label === 'liveCodeBench') label = 'LiveCode';
        if (label === 'ifEval') label = 'IFEval';
        if (label === 'mmluPro') label = 'MMLU-Pro';
        if (label === 'contextWindow') label = 'Context';
        if (label === 'speedProxy') label = 'Speed';
        if (label === 'multimodal') label = 'Vision';
        if (label === 'Arena overall') label = 'Arena';
        if (label === 'Arena coding') label = 'Arena Code';
        if (label === 'Arena math') label = 'Arena Math';
        if (label === 'Arena creativeWriting') label = 'Arena CW';
        if (label === 'Arena instructionFollowing') label = 'Arena IF';
        if (label === 'Arena longerQuery') label = 'Arena LQ';
        if (d.metric === 'toolCallingBonus') return 'Tool Use';
        if (d.metric === 'contextWindow' || d.metric === 'speedProxy' || d.metric === 'multimodal') return label;
        var displayVal = d.metric.indexOf('arenaElo') >= 0 ? Math.round(d.raw) : (Math.round(d.raw * 10) / 10) + '%';
        return label + ' ' + displayVal;
    });
}

// ===== ADVANCED SCORING (Filter Redesign) =====
function classifyMetric(metricKey) {
    if (metricKey.indexOf('arenaElo.') === 0) return 'arena';
    if (metricKey.indexOf('benchmarks.') === 0) return 'benchmark';
    return 'other';
}

function hasBenchmarkMetrics(useCaseKey) {
    var weights = modelData.scoringConfig[useCaseKey]?.weights || {};
    return Object.keys(weights).some(function(k) { return k.indexOf('benchmarks.') === 0; });
}

function hasArenaMetrics(useCaseKey) {
    var weights = modelData.scoringConfig[useCaseKey]?.weights || {};
    return Object.keys(weights).some(function(k) { return k.indexOf('arenaElo.') === 0; });
}

function buildAdjustedWeights(useCaseKey, rankBy, boosts) {
    var config = modelData.scoringConfig[useCaseKey];
    if (!config) return { adjustedWeights: {}, normRanges: {} };

    var weights = {};
    Object.keys(config.weights).forEach(function(k) { weights[k] = config.weights[k]; });
    var normRanges = {};
    if (config.normRanges) Object.keys(config.normRanges).forEach(function(k) { normRanges[k] = config.normRanges[k]; });

    // Rank By adjustment: redistribute weights between arena and benchmark
    if (rankBy !== 'balanced') {
        var zeroType = (rankBy === 'benchmark') ? 'arena' : 'benchmark';
        var boostType = (rankBy === 'benchmark') ? 'benchmark' : 'arena';
        var removedWeight = 0;
        var boostMetrics = [];

        Object.keys(weights).forEach(function(metric) {
            var type = classifyMetric(metric);
            if (type === zeroType) {
                removedWeight += weights[metric];
                weights[metric] = 0;
            } else if (type === boostType) {
                boostMetrics.push(metric);
            }
        });

        if (boostMetrics.length > 0 && removedWeight > 0) {
            var currentTotal = boostMetrics.reduce(function(s, m) { return s + weights[m]; }, 0);
            if (currentTotal > 0) {
                boostMetrics.forEach(function(m) {
                    weights[m] += removedWeight * (weights[m] / currentTotal);
                });
            } else {
                var share = removedWeight / boostMetrics.length;
                boostMetrics.forEach(function(m) { weights[m] = share; });
            }
        } else if (boostMetrics.length === 0 && removedWeight > 0) {
            // No target metrics exist — redistribute to 'other' metrics
            var otherMetrics = Object.keys(weights).filter(function(m) {
                return classifyMetric(m) === 'other' && weights[m] > 0;
            });
            if (otherMetrics.length > 0) {
                var otherTotal = otherMetrics.reduce(function(s, m) { return s + weights[m]; }, 0);
                otherMetrics.forEach(function(m) {
                    weights[m] += removedWeight * (weights[m] / otherTotal);
                });
            }
        }
    }

    // Boost: Long Context — increase contextWindow weight to at least 0.35
    if (boosts.has('long-context')) {
        var cwKey = 'contextWindow';
        if (weights.hasOwnProperty(cwKey)) {
            var oldCW = weights[cwKey];
            var newCW = Math.max(0.35, oldCW);
            var delta = newCW - oldCW;
            if (delta > 0) {
                var others = Object.keys(weights).filter(function(k) { return k !== cwKey && weights[k] > 0; });
                var othersSum = others.reduce(function(s, k) { return s + weights[k]; }, 0);
                if (othersSum > 0) {
                    others.forEach(function(k) { weights[k] -= delta * (weights[k] / othersSum); });
                }
                weights[cwKey] = newCW;
            }
        } else {
            // Add contextWindow to this use case's weights
            var totalW = Object.keys(weights).reduce(function(s, k) { return s + weights[k]; }, 0);
            var stealRatio = 0.35 / (totalW + 0.35);
            Object.keys(weights).forEach(function(k) { weights[k] *= (1 - stealRatio); });
            weights[cwKey] = 0.35;
            normRanges[cwKey] = 'log';
        }
    }

    // Remove zero-weight entries
    Object.keys(weights).forEach(function(k) {
        if (weights[k] <= 0.001) delete weights[k];
    });

    return { adjustedWeights: weights, normRanges: normRanges };
}

function computeCapabilityScoreWithWeights(model, adjustedWeights, normRanges) {
    var breakdown = [];
    var totalWeight = 0;
    var availableWeight = 0;

    Object.keys(adjustedWeights).forEach(function(metric) {
        var raw = getMetricValue(model, metric);
        totalWeight += adjustedWeights[metric];
        if (raw !== null) availableWeight += adjustedWeights[metric];
    });

    if (availableWeight === 0) return { score: 0, breakdown: [], completeness: 0 };

    var completeness = availableWeight / totalWeight;
    var weightScale = completeness >= 0.6 ? (totalWeight / availableWeight) : 1;
    var score = 0;

    Object.keys(adjustedWeights).forEach(function(metric) {
        var raw = getMetricValue(model, metric);
        if (raw === null) return;
        var normalized;
        if (metric === 'contextWindow' || metric === 'speedProxy' || metric === 'multimodal') {
            normalized = raw;
        } else if (normRanges && normRanges[metric] && normRanges[metric] !== 'log') {
            normalized = normalizeMetric(raw, normRanges[metric][0], normRanges[metric][1]);
        } else {
            normalized = raw;
        }
        var scaledWeight = adjustedWeights[metric] * weightScale;
        var contribution = normalized * scaledWeight / 100;
        score += contribution;
        breakdown.push({ metric: metric, raw: raw, normalized: Math.round(normalized), weight: scaledWeight, contribution: contribution });
    });

    score = Math.max(0, Math.min(100, score * 100 / totalWeight));
    score = Math.round(score);

    return { score: score, breakdown: breakdown.sort(function(a, b) { return b.contribution - a.contribution; }), completeness: completeness };
}

function rankModelsAdvanced(useCaseKey, optimizeFor, rankBy, boosts) {
    var adjusted = buildAdjustedWeights(useCaseKey, rankBy, boosts);

    var results = modelData.models.map(function(model) {
        var cap = computeCapabilityScoreWithWeights(model, adjusted.adjustedWeights, adjusted.normRanges);

        // Tool Calling boost
        if (boosts.has('tool-calling') && model.specs && model.specs.supportsFunctionCalling) {
            cap.score = Math.min(100, cap.score + 8);
            cap.breakdown.push({ metric: 'toolCallingBonus', raw: 1, normalized: 80, weight: 0.08, contribution: 8 });
        }

        var val = computeValueScore(model, cap.score);
        return { model: model, capabilityScore: cap.score, valueScore: val, breakdown: cap.breakdown, completeness: cap.completeness };
    });

    results.forEach(function(r) {
        r.overallScore = Math.round(r.capabilityScore * 0.7 + r.valueScore * 0.3);
    });

    // Sort based on optimizeFor
    if (optimizeFor === 'low-cost') {
        results.sort(function(a, b) { return b.valueScore - a.valueScore; });
    } else if (optimizeFor === 'balanced') {
        results.sort(function(a, b) { return b.overallScore - a.overallScore; });
    } else if (optimizeFor === 'fast') {
        results.forEach(function(r) {
            r.speedAdjustedScore = Math.round(r.capabilityScore * 0.6 + getSpeedProxy(r.model) * 0.4);
        });
        results.sort(function(a, b) { return b.speedAdjustedScore - a.speedAdjustedScore; });
    } else if (optimizeFor === 'context') {
        results.forEach(function(r) {
            var ctx = r.model.contextWindow || 0;
            var ctxNorm = Math.min(100, (ctx / 1000000) * 100);
            r.contextAdjustedScore = Math.round(r.capabilityScore * 0.6 + ctxNorm * 0.4);
        });
        results.sort(function(a, b) { return b.contextAdjustedScore - a.contextAdjustedScore; });
    } else {
        // quality
        results.sort(function(a, b) { return b.capabilityScore - a.capabilityScore; });
    }

    return results;
}

// ===== MODAL FUNCTIONS =====
function openModelModal(modelId) {
    const model = getModelById(modelId);
    if (!model) return;
    const modal = document.getElementById('modelModal');
    if (!modal) return;
    document.getElementById('modalModelName').textContent = model.name;
    document.getElementById('modalProvider').textContent = getProviderName(model.provider);

    const costBadge = document.getElementById('modalCostBadge');
    costBadge.textContent = getCostLabel(model.costTier);
    costBadge.className = 'cost-badge cost-' + (model.costTier === 'self-hosted' ? 'self' : model.costTier);

    document.getElementById('modalOverview').textContent = ml(model, 'overview') || ml(model, 'description');

    // Specs — numeric first, then categorical
    const na = t('modal.na');
    const specs = [
        { label: t('modal.contextWindow'), value: formatTokenCount(model.contextWindow) },
        { label: t('modal.maxOutput'), value: model.maxOutputTokens ? formatTokenCount(model.maxOutputTokens) : na },
        { label: t('modal.latency'), value: formatSpeed(model) !== '—' ? formatSpeed(model) : na },
        { label: t('modal.outputSpeed'), value: model.outputTokensPerSec ? model.outputTokensPerSec + ' tok/s' : na },
        { label: t('modal.ttft'), value: model.ttft ? (model.ttft >= 10 ? model.ttft.toFixed(1) + 's' : model.ttft.toFixed(2) + 's') : na },
    ];
    // Pricing
    if (model.pricing?.inputPerMillion != null) {
        specs.push({ label: t('modal.inputPrice'), value: '$' + model.pricing.inputPerMillion.toFixed(2) });
        specs.push({ label: t('modal.outputPrice'), value: '$' + model.pricing.outputPerMillion.toFixed(2) });
    } else {
        specs.push({ label: t('modal.pricing'), value: t('cell.selfHosted') });
    }
    // Categorical
    specs.push(
        { label: t('modal.multimodal'), value: model.specs?.multimodal ? model.specs.multimodalTypes.join(', ') : t('modal.textOnly') },
        { label: t('modal.released'), value: model.specs?.releaseDate || na },
        { label: t('modal.hosting'), value: getHostingLabel(model) },
        { label: t('modal.availableVia'), value: (function() {
            var avail = model.specs?.apiAvailability || getCloudPlatformLabels(model).join(', ') || '';
            avail = avail.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s && s.toLowerCase() !== 'api'; }).join(', ');
            return avail || na;
        })() }
    );
    // Add self-hosting specs only for open-source models
    if (model.deployment?.selfHostable) {
        if (model.specs?.parameters) specs.push({ label: t('modal.parameters'), value: model.specs.parameters });
        if (model.specs?.minVram) specs.push({ label: t('modal.minVram'), value: model.specs.minVram });
    }
    document.getElementById('modalSpecs').innerHTML = specs.map(s =>
        `<div class="modal-spec"><div class="modal-spec-label">${s.label}</div><div class="modal-spec-value">${s.value}</div></div>`
    ).join('') + (model.pricing?.notes ? `<div class="modal-spec-note">${model.pricing.notes}</div>` : '');

    // Hide separate pricing section
    const pricingSection = document.getElementById('modalPricingSection');
    if (pricingSection) pricingSection.style.display = 'none';

    // Strengths & Weaknesses
    document.getElementById('modalStrengths').innerHTML = (ml(model, 'strengths') || []).map(s => `<li>${s}</li>`).join('') || '<li>' + t('modal.noData') + '</li>';
    document.getElementById('modalWeaknesses').innerHTML = (ml(model, 'weaknesses') || []).map(w => `<li>${w}</li>`).join('') || '<li>' + t('modal.noData') + '</li>';

    // Use Cases
    const ucEl = document.getElementById('modalUseCases');
    const ucSection = document.getElementById('modalUseCasesSection');
    const ucData = ml(model, 'useCaseDetails') || [];
    if (ucData.length > 0) {
        ucEl.innerHTML = ucData.map(uc => `<div style="margin-bottom:10px;"><strong style="color:var(--text-primary);font-size:0.85rem;">${uc.name}</strong><p style="color:var(--text-muted);font-size:0.8rem;margin:2px 0 0;">${uc.explanation}</p></div>`).join('');
        ucSection.style.display = '';
    } else if (model.bestFor?.length > 0) {
        ucEl.innerHTML = `<p style="color:var(--text-muted);">Best for: ${model.bestFor.join(', ')}</p>`;
        ucSection.style.display = '';
    } else {
        ucSection.style.display = 'none';
    }

    // Sources
    const sourcesEl = document.getElementById('modalSources');
    const sourcesSection = document.getElementById('modalSourcesSection');
    const sourceLabels = { pricing: t('source.pricing'), docs: t('source.docs'), announcement: t('source.announcement'), guide: t('source.guide'), github: t('source.github'), huggingface: t('source.huggingface'), benchmarks: t('source.benchmarks') };
    if (model.sourceUrls && Object.keys(model.sourceUrls).length > 0) {
        sourcesEl.innerHTML = Object.entries(model.sourceUrls).map(([key, url]) =>
            `<a href="${url}" target="_blank" rel="noopener">${sourceLabels[key] || key} &#8599;</a>`
        ).join('');
        sourcesSection.style.display = '';
    } else {
        const provider = modelData.providers[model.provider];
        if (provider?.docsUrl || provider?.pricingUrl) {
            let html = '';
            if (provider.pricingUrl) html += `<a href="${provider.pricingUrl}" target="_blank" rel="noopener">${t('source.providerPricing')} &#8599;</a>`;
            if (provider.docsUrl) html += `<a href="${provider.docsUrl}" target="_blank" rel="noopener">${t('source.providerDocs')} &#8599;</a>`;
            sourcesEl.innerHTML = html;
            sourcesSection.style.display = '';
        } else {
            sourcesSection.style.display = 'none';
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModelModal() {
    document.getElementById('modelModal')?.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== MOBILE MENU + TOGGLES =====
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const menuOverlay = document.querySelector(".mobile-menu-overlay");
    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener("click", () => { menuOverlay.classList.toggle("open"); menuBtn.classList.toggle("active"); });
        menuOverlay.addEventListener("click", (e) => { if (e.target === menuOverlay) { menuOverlay.classList.remove("open"); menuBtn.classList.remove("active"); } });
    }

    // Close modal on overlay click
    const modalOverlay = document.getElementById('modelModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModelModal(); });
    }

    // Theme toggle
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    });

    // Language toggle
    function updateLangBtns() {
        var lang = document.documentElement.getAttribute('data-lang') || 'en';
        document.querySelectorAll('.lang-label').forEach(el => { el.textContent = lang === 'en' ? 'TR' : 'EN'; });
    }
    updateLangBtns();
    document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            var current = document.documentElement.getAttribute('data-lang') || 'en';
            var next = current === 'en' ? 'tr' : 'en';
            document.documentElement.setAttribute('data-lang', next);
            localStorage.setItem('lang', next);
            applyTranslations();
            updateLangBtns();
            // Re-render page content if a render function exists
            if (typeof window.renderPage === 'function') window.renderPage();
        });
    });

    // Apply translations on load
    applyTranslations();
});
