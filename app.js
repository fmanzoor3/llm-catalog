/* ============================================
   LLM Selection Guide — Application Logic
   Shared utilities + page-specific logic
   ============================================ */

// ===== HELPERS =====
function getModelById(id) { return modelData.models.find(m => m.id === id); }
function getProviderName(providerId) { return modelData.providers[providerId]?.displayName || providerId; }

function formatTokenCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
    return n.toString();
}

function getCostLabel(cost) {
    if (cost === 'self-hosted') return 'Self-hosted';
    if (cost === 'low') return '$';
    if (cost === 'mid') return '$$';
    return '$$$';
}

function getProviderClass(providerId) {
    const map = {
        anthropic: 'bg-anthropic', openai: 'bg-openai', google: 'bg-google',
        deepseek: 'bg-deepseek', xai: 'bg-xai', moonshot: 'bg-moonshot',
        opensource: 'bg-opensource'
    };
    return map[providerId] || 'bg-opensource';
}

function getProviderAbbrev(providerId) {
    const map = {
        anthropic: 'ANT', openai: 'OAI', google: 'GDM',
        deepseek: 'DS', xai: 'xAI', moonshot: 'MS',
        opensource: 'OSS'
    };
    return map[providerId] || providerId.substring(0, 3).toUpperCase();
}

function getBlendedCost(model) {
    if (!model.pricing) return 0;
    return (model.pricing.inputPerMillion + model.pricing.outputPerMillion) / 2;
}

function formatCost(model) {
    if (!model.pricing) return 'Self-hosted';
    return '$' + model.pricing.inputPerMillion.toFixed(2) + '/' + model.pricing.outputPerMillion.toFixed(2);
}

function formatSpeed(model) {
    // Use costTier as proxy
    if (model.costTier === 'low' || model.costTier === 'self-hosted') return 'Fast';
    if (model.costTier === 'mid') return 'Medium';
    return 'Slower';
}

// ===== DEPLOYMENT HELPERS =====
function getHostingLabel(model) {
    var d = model.deployment;
    if (!d) return model.specs?.apiAvailability || 'API';
    if (d.hostedOnPrem) return 'Running On-Prem';
    if (d.selfHostable) return 'Self-Hosted + API';
    return 'API';
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
    var logVal = Math.log2(tokens / 1000);
    return Math.max(0, Math.min(100, (logVal - 5) * 7.5 + 20));
}

function getSpeedProxy(model) {
    if (model.costTier === 'low' || model.costTier === 'self-hosted') return 80;
    if (model.costTier === 'mid') return 50;
    return 30;
}

function getMetricValue(model, metricKey) {
    if (metricKey === 'speedProxy') return getSpeedProxy(model);
    if (metricKey === 'contextWindow') return normalizeContextWindow(model.contextWindow);
    if (metricKey === 'multimodal') return (model.specs && model.specs.multimodal) ? 80 : 20;
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

    var weightScale = totalWeight / availableWeight;
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
        var adjustedWeight = weights[metric] * weightScale;
        var contribution = normalized * adjustedWeight / 100;
        score += contribution;
        breakdown.push({ metric, raw, normalized: Math.round(normalized), weight: adjustedWeight, contribution });
    });

    score = Math.max(0, Math.min(100, score * 100 / totalWeight));
    var completeness = availableWeight / totalWeight;
    if (completeness < 0.5) score = score * (0.5 + completeness);
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
        if (label === 'contextWindow') label = 'Context';
        if (label === 'speedProxy') label = 'Speed';
        if (label === 'multimodal') label = 'Vision';
        if (label === 'Arena overall') label = 'Arena';
        if (label === 'Arena coding') label = 'Arena Code';
        if (label === 'Arena math') label = 'Arena Math';
        if (label === 'Arena creativeWriting') label = 'Arena CW';
        if (label === 'Arena instructionFollowing') label = 'Arena IF';
        if (label === 'Arena longerQuery') label = 'Arena LQ';
        if (d.metric === 'contextWindow' || d.metric === 'speedProxy' || d.metric === 'multimodal') return label;
        var displayVal = d.metric.indexOf('arenaElo') >= 0 ? Math.round(d.raw) : (Math.round(d.raw * 10) / 10) + '%';
        return label + ' ' + displayVal;
    });
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
    costBadge.className = 'cost-badge cost-' + (model.costTier === 'self-hosted' ? 'low' : model.costTier);

    document.getElementById('modalOverview').textContent = model.overview || model.description;

    // Specs
    const specs = [
        { label: 'Context Window', value: formatTokenCount(model.contextWindow) },
        { label: 'Max Output', value: model.maxOutputTokens ? formatTokenCount(model.maxOutputTokens) : 'N/A' },
        { label: 'Multimodal', value: model.specs?.multimodal ? model.specs.multimodalTypes.join(', ') : 'Text only' },
        { label: 'Released', value: model.specs?.releaseDate || 'N/A' },
        { label: 'Training Cutoff', value: model.specs?.trainingDataCutoff || 'N/A' },
        { label: 'Hosting', value: getHostingLabel(model) },
        { label: 'Platforms', value: getCloudPlatformLabels(model).join(', ') || model.specs?.apiAvailability || 'Direct API' }
    ];
    document.getElementById('modalSpecs').innerHTML = specs.map(s =>
        `<div class="modal-spec"><div class="modal-spec-label">${s.label}</div><div class="modal-spec-value">${s.value}</div></div>`
    ).join('');

    // Pricing
    const pricingEl = document.getElementById('modalPricing');
    if (model.pricing?.inputPerMillion != null) {
        pricingEl.innerHTML = `
            <div class="modal-price-item"><div class="modal-price-label">Input / 1M</div><div class="modal-price-value">$${model.pricing.inputPerMillion.toFixed(2)}</div></div>
            <div class="modal-price-item"><div class="modal-price-label">Output / 1M</div><div class="modal-price-value">$${model.pricing.outputPerMillion.toFixed(2)}</div></div>
        ` + (model.pricing.notes ? `<div style="grid-column:1/-1;font-size:0.78rem;color:var(--text-muted);padding-top:4px;">${model.pricing.notes}</div>` : '');
    } else {
        pricingEl.innerHTML = '<div class="modal-price-item" style="grid-column:1/-1;"><div class="modal-price-value" style="font-size:0.88rem;">Self-hosted — cost depends on infrastructure</div></div>';
    }

    // Strengths & Weaknesses
    document.getElementById('modalStrengths').innerHTML = (model.strengths || []).map(s => `<li>${s}</li>`).join('') || '<li>No data</li>';
    document.getElementById('modalWeaknesses').innerHTML = (model.weaknesses || []).map(w => `<li>${w}</li>`).join('') || '<li>No data</li>';

    // Use Cases
    const ucEl = document.getElementById('modalUseCases');
    const ucSection = document.getElementById('modalUseCasesSection');
    if (model.useCaseDetails?.length > 0) {
        ucEl.innerHTML = model.useCaseDetails.map(uc => `<div style="margin-bottom:10px;"><strong style="color:var(--text-primary);font-size:0.85rem;">${uc.name}</strong><p style="color:var(--text-muted);font-size:0.8rem;margin:2px 0 0;">${uc.explanation}</p></div>`).join('');
        ucSection.style.display = '';
    } else if (model.bestFor?.length > 0) {
        ucEl.innerHTML = `<p style="color:var(--text-muted);">Best for: ${model.bestFor.join(', ')}</p>`;
        ucSection.style.display = '';
    } else {
        ucSection.style.display = 'none';
    }

    // Benchmarks
    const benchEl = document.getElementById('modalBenchmarks');
    const benchSection = document.getElementById('modalBenchmarksSection');
    const benchNames = { sweBenchVerified: 'SWE-bench', sweBenchPro: 'SWE-bench Pro', gpqaDiamond: 'GPQA Diamond', aime2024: 'AIME 2024', aiderPolyglot: 'Aider', mmmlu: 'MMMLU', math500: 'MATH 500', arcAgi1: 'ARC-AGI-1', bigLawBench: 'BigLaw' };
    const benchEntries = Object.entries(model.benchmarks || {}).filter(([k, v]) => v != null);
    const arenaEntries = Object.entries(model.arenaElo || {}).filter(([k, v]) => v != null);

    if (benchEntries.length > 0 || arenaEntries.length > 0) {
        let html = benchEntries.map(([k, v]) =>
            `<div class="modal-benchmark"><div class="modal-benchmark-name">${benchNames[k] || k}</div><div class="modal-benchmark-value">${v}${typeof v === 'number' && v <= 100 ? '%' : ''}</div></div>`
        ).join('');
        arenaEntries.forEach(([k, v]) => {
            html += `<div class="modal-benchmark"><div class="modal-benchmark-name">Arena ${k}</div><div class="modal-benchmark-value">${v}</div></div>`;
        });
        benchEl.innerHTML = html;
        benchSection.style.display = '';
    } else {
        benchSection.style.display = 'none';
    }

    // Tags
    document.getElementById('modalTags').innerHTML = (model.bestFor || []).map(t => `<span class="modal-tag">${t}</span>`).join('');

    // Sources
    const sourcesEl = document.getElementById('modalSources');
    const sourcesSection = document.getElementById('modalSourcesSection');
    const sourceLabels = { pricing: 'Pricing', docs: 'Documentation', announcement: 'Announcement', guide: 'Developer Guide', github: 'GitHub', huggingface: 'HuggingFace', benchmarks: 'Benchmarks' };
    if (model.sourceUrls && Object.keys(model.sourceUrls).length > 0) {
        sourcesEl.innerHTML = Object.entries(model.sourceUrls).map(([key, url]) =>
            `<a href="${url}" target="_blank" rel="noopener">${sourceLabels[key] || key} &#8599;</a>`
        ).join('');
        sourcesSection.style.display = '';
    } else {
        const provider = modelData.providers[model.provider];
        if (provider?.docsUrl || provider?.pricingUrl) {
            let html = '';
            if (provider.pricingUrl) html += `<a href="${provider.pricingUrl}" target="_blank" rel="noopener">Provider Pricing &#8599;</a>`;
            if (provider.docsUrl) html += `<a href="${provider.docsUrl}" target="_blank" rel="noopener">Provider Docs &#8599;</a>`;
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

// ===== MOBILE MENU =====
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
});
