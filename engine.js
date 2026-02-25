function populateComparisonTable() {
        const tbody = document.getElementById('comparisonBody');
        modelData.quickDecisions.forEach((qd, rowIndex) => {
            const rowId = 'comparison-row-' + rowIndex;
            const detailId = 'comparison-detail-' + rowIndex;

            const cells = qd.recommendations.map((id, idx) => {
                const model = getModelById(id);
                const name = model ? model.name : id;
                const cls = idx === 0 ? ' class="best"' : '';
                return '<td' + cls + '><span class="clickable-model" onclick="event.stopPropagation(); openModelModal(\'' + id + '\')">' + name + '</span></td>';
            });

            // Main row (clickable)
            tbody.innerHTML += '<tr class="comparison-row" id="' + rowId + '" onclick="toggleComparisonDetail(\'' + rowIndex + '\')"><td>' + qd.priority + '</td>' + cells.join('') + '</tr>';

            // Detail row (hidden by default)
            tbody.innerHTML += '<tr class="comparison-detail" id="' + detailId + '"><td colspan="4">' + buildDetailContent(qd.priority) + '</td></tr>';
        });
    }

    function buildDetailContent(priority) {
        const details = categoryDetails[priority];
        if (!details) return '<p style="color:#888">No detailed information available for this category.</p>';

        let html = '<div class="detail-content">';
        html += '<div class="detail-header">';
        html += '<div><h4>' + priority + '</h4><p>' + details.description + '</p></div>';
        html += '<div class="benchmark-explainer"><strong>' + details.benchmark + ':</strong> ' + details.benchmarkExplainer + '</div>';
        html += '</div>';

        html += '<ul class="ranking-list">';
        details.rankings.forEach((item, idx) => {
            const model = getModelById(item.id);
            const rankClass = idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'bronze' : 'other';

            html += '<li class="ranking-item" onclick="event.stopPropagation(); openModelModal(\'' + item.id + '\')">';
            html += '<div class="ranking-number ' + rankClass + '">' + (idx + 1) + '</div>';
            html += '<div class="ranking-info">';
            html += '<h5>' + (model ? model.name : item.id) + '</h5>';
            html += '<span class="provider-tag">' + (model ? getProviderName(model.provider) : '') + '</span>';
            html += '<p class="ranking-reason">' + item.reason + '</p>';
            html += '</div>';
            html += '<div class="ranking-stats">';
            Object.entries(item.stats).forEach(([label, statData]) => {
                const isHighlight = label.includes('SWE') || label.includes('GPQA') || label.includes('AIME') || label.includes('ARC');
                // Support both old format (string) and new format ({value, source})
                const value = typeof statData === 'object' ? statData.value : statData;
                const source = typeof statData === 'object' ? statData.source : null;

                if (source) {
                    // Clickable stat with source link
                    html += '<a href="' + source + '" target="_blank" rel="noopener" class="stat-chip stat-chip-link" onclick="event.stopPropagation()" title="Click to verify source">';
                    html += '<div class="stat-label">' + label + ' <span class="source-icon">↗</span></div>';
                    html += '<div class="stat-value' + (isHighlight ? ' highlight' : '') + '">' + value + '</div>';
                    html += '</a>';
                } else {
                    // Non-clickable stat (no source available)
                    html += '<div class="stat-chip">';
                    html += '<div class="stat-label">' + label + '</div>';
                    html += '<div class="stat-value' + (isHighlight ? ' highlight' : '') + '">' + value + '</div>';
                    html += '</div>';
                }
            });
            html += '</div>';
            html += '</li>';
        });
        html += '</ul>';
        html += '</div>';

        return html;
    }

    function toggleComparisonDetail(rowIndex) {
        const row = document.getElementById('comparison-row-' + rowIndex);
        const detail = document.getElementById('comparison-detail-' + rowIndex);

        // Close all other details first
        document.querySelectorAll('.comparison-row.expanded').forEach(r => {
            if (r.id !== row.id) {
                r.classList.remove('expanded');
                document.getElementById(r.id.replace('row', 'detail')).classList.remove('active');
            }
        });

        row.classList.toggle('expanded');
        detail.classList.toggle('active');
    }

    function populateReferences() {
        const grid = document.getElementById('referencesGrid');
        const categories = {
            'openai': 'OpenAI (GPT)', 'claude': 'Claude (Anthropic)', 'google': 'Google (Gemini)',
            'deepseek': 'DeepSeek', 'meta': 'Meta (Llama)', 'alibaba': 'Alibaba (Qwen)', 'mistral': 'Mistral AI', 'benchmarks': 'Benchmarks & Comparisons'
        };
        Object.entries(modelData.references).forEach(([key, refs]) => {
            const title = categories[key] || key;
            const links = refs.map(r => '<li><a href="' + r.url + '" target="_blank">' + r.name + '</a></li>').join('');
            grid.innerHTML += '<div class="ref-group"><h3>' + title + '</h3><ul>' + links + '</ul></div>';
        });
    }

    // ===== SCORING ENGINE =====

    function normalizeMetric(value, min, max) {
        if (value === null || value === undefined) return null;
        return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    }

    function normalizeContextWindow(tokens) {
        if (!tokens) return 0;
        // Log-scale: 128K→50, 200K→60, 256K→65, 400K→72, 1M→85, 2M→93, 10M→100
        var logVal = Math.log2(tokens / 1000);
        return Math.max(0, Math.min(100, (logVal - 5) * 7.5 + 20));
    }

    function getSpeedProxy(model) {
        // Approximate speed from cost tier (inverse relationship)
        if (model.costTier === 'low' || model.costTier === 'self-hosted') return 80;
        if (model.costTier === 'mid') return 50;
        return 30; // high
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

        // First pass: find which metrics are available
        Object.keys(weights).forEach(function(metric) {
            var raw = getMetricValue(model, metric);
            totalWeight += weights[metric];
            if (raw !== null) availableWeight += weights[metric];
        });

        if (availableWeight === 0) return { score: 0, breakdown: [], completeness: 0 };

        var weightScale = totalWeight / availableWeight; // redistribute missing weights
        var score = 0;

        Object.keys(weights).forEach(function(metric) {
            var raw = getMetricValue(model, metric);
            if (raw === null) return;

            var normalized;
            if (metric === 'contextWindow' || metric === 'speedProxy' || metric === 'multimodal') {
                normalized = raw; // already 0-100
            } else if (normRanges && normRanges[metric] && normRanges[metric] !== 'log') {
                normalized = normalizeMetric(raw, normRanges[metric][0], normRanges[metric][1]);
            } else {
                normalized = raw; // fallback
            }

            var adjustedWeight = weights[metric] * weightScale;
            var contribution = normalized * adjustedWeight / 100;
            score += contribution;

            breakdown.push({
                metric: metric,
                raw: raw,
                normalized: Math.round(normalized),
                weight: adjustedWeight,
                contribution: contribution
            });
        });

        score = Math.max(0, Math.min(100, score * 100 / totalWeight));

        // Penalize low data completeness: models with <50% data get scaled down
        var completeness = availableWeight / totalWeight;
        if (completeness < 0.5) {
            score = score * (0.5 + completeness);
        }
        score = Math.round(score);

        return {
            score: score,
            breakdown: breakdown.sort(function(a, b) { return b.contribution - a.contribution; }),
            completeness: completeness
        };
    }

    function computeValueScore(model, capScore) {
        if (model.costTier === 'self-hosted' || !model.pricing) {
            return Math.round(capScore * 0.9); // self-hosted gets 90% of capability as value
        }
        var blendedCost = (model.pricing.inputPerMillion + model.pricing.outputPerMillion) / 2;
        if (blendedCost <= 0) return capScore;
        var rawValue = capScore / (Math.log2(blendedCost + 1) + 0.5);
        // Normalize: a perfect model at $0.10/M avg would score ~100, expensive model at $100/M ~20
        return Math.round(Math.max(0, Math.min(100, rawValue * 1.8)));
    }

    function rankModelsForUseCase(useCaseKey, sortBy) {
        var results = modelData.models.map(function(model) {
            var cap = computeCapabilityScore(model, useCaseKey);
            var val = computeValueScore(model, cap.score);
            return {
                model: model,
                capabilityScore: cap.score,
                valueScore: val,
                breakdown: cap.breakdown,
                completeness: cap.completeness
            };
        });

        // Compute overall score (blend of capability + value)
        results.forEach(function(r) {
            r.overallScore = Math.round(r.capabilityScore * 0.7 + r.valueScore * 0.3);
        });

        // Sort
        if (sortBy === 'cost') {
            results.sort(function(a, b) { return b.valueScore - a.valueScore; });
        } else if (sortBy === 'best') {
            results.sort(function(a, b) { return b.overallScore - a.overallScore; });
        } else {
            results.sort(function(a, b) { return b.capabilityScore - a.capabilityScore; });
        }

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

            if (d.metric === 'contextWindow' || d.metric === 'speedProxy' || d.metric === 'multimodal') {
                return label;
            }
            var displayVal = d.metric.indexOf('arenaElo') >= 0 ?
                Math.round(d.raw) :
                (Math.round(d.raw * 10) / 10) + '%';
            return label + ' ' + displayVal;
        });
    }

    // ===== END SCORING ENGINE =====

    function updateRecommendations() {
        var useCase = document.getElementById('useCase').value;
        var priority = document.getElementById('priority').value;
        var budget = document.getElementById('budget').value;
        var container = document.getElementById('recCards');

        var effectivePriority = priority || 'best';
        var priorityDescs = {
            'best': 'Balanced ranking combining quality and cost efficiency',
            'quality': 'Ranked purely by benchmark performance, regardless of cost',
            'cost': 'Best quality relative to price \u2014 great models that won\u2019t break the bank',
            'speed': 'Optimized for low latency and fast token generation',
            'privacy': 'Open-weight models you can self-host for full data control'
        };
        var descEl = document.getElementById('priorityDesc');
        if (descEl) descEl.textContent = priorityDescs[effectivePriority] || '';

        if (!useCase) { container.innerHTML = '<p class="no-results">Select a use case to see recommendations</p>'; return; }

        var sortBy = effectivePriority === 'cost' ? 'cost' : effectivePriority === 'best' ? 'best' : 'capability';

        // Use scoring engine to rank all models
        var ranked = rankModelsForUseCase(useCase, sortBy);

        // For privacy: filter to self-hosted/open-weight models
        if (effectivePriority === 'privacy') {
            ranked = ranked.filter(function(r) {
                return r.model.costTier === 'self-hosted' ||
                    (r.model.specs && r.model.specs.apiAvailability && r.model.specs.apiAvailability.toLowerCase().indexOf('self-hosted') >= 0);
            });
            // Re-sort by capability for privacy
            ranked.sort(function(a, b) { return b.capabilityScore - a.capabilityScore; });
        }

        // For speed priority: boost speed proxy
        if (effectivePriority === 'speed') {
            ranked.forEach(function(r) {
                var speedBonus = getSpeedProxy(r.model) * 0.3;
                r.capabilityScore = Math.round(r.capabilityScore * 0.7 + speedBonus);
            });
            ranked.sort(function(a, b) { return b.capabilityScore - a.capabilityScore; });
        }

        // Budget filter
        if (budget) {
            ranked = ranked.filter(function(r) {
                if (budget === 'low') return r.model.costTier === 'low' || r.model.costTier === 'self-hosted';
                if (budget === 'mid') return r.model.costTier !== 'high';
                return true;
            });
        }

        // Filter out models with zero score
        ranked = ranked.filter(function(r) { return r.capabilityScore > 0; });

        if (ranked.length === 0) {
            container.innerHTML = '<p class="no-results">No models match your criteria. Try adjusting filters.</p>';
            document.getElementById('scoreLegend').innerHTML = '';
            return;
        }

        // Update score legend based on mode
        var legendEl = document.getElementById('scoreLegend');
        var ucName = modelData.scoringConfig[useCase] ? modelData.scoringConfig[useCase].name : useCase;
        if (effectivePriority === 'best') {
            legendEl.innerHTML = '<span class="legend-item"><span class="legend-dot overall"></span> <strong>Overall</strong> = quality + cost efficiency combined</span>' +
                '<span class="legend-item"><span class="legend-dot efficiency"></span> <strong>Cost Efficiency</strong> = quality relative to price</span>' +
                '<span style="color:#666;font-size:0.75rem;">Scores 0\u2013100, based on benchmarks and human preference rankings for ' + ucName + '</span>';
        } else if (effectivePriority === 'cost') {
            legendEl.innerHTML = '<span class="legend-item"><span class="legend-dot efficiency"></span> <strong>Cost Efficiency</strong> = quality you get per dollar spent</span>' +
                '<span class="legend-item"><span class="legend-dot quality"></span> <strong>Quality</strong> = benchmark performance for ' + ucName + '</span>' +
                '<span style="color:#666;font-size:0.75rem;">Sorted by cost efficiency</span>';
        } else {
            legendEl.innerHTML = '<span class="legend-item"><span class="legend-dot quality"></span> <strong>Quality</strong> = benchmark performance for ' + ucName + '</span>' +
                '<span class="legend-item"><span class="legend-dot efficiency"></span> <strong>Cost Efficiency</strong> = quality relative to price</span>' +
                '<span style="color:#666;font-size:0.75rem;">Sorted by quality</span>';
        }

        var initialShow = 10;
        var hasMore = ranked.length > initialShow;

        // Determine columns based on mode
        var primaryLabel = effectivePriority === 'best' ? 'Overall' : 'Quality';
        var primaryClass = effectivePriority === 'best' ? 'overall' : 'quality';

        var html = '<table class="rec-table"><thead><tr>' +
            '<th>#</th><th>Model</th><th style="text-align:right">' + primaryLabel + '</th>' +
            '<th style="text-align:right">Value</th><th>Cost</th><th>Key Strengths</th>' +
            '</tr></thead><tbody>';

        html += ranked.map(function(r, idx) {
            var model = r.model;
            var costClass = model.costTier === 'self-hosted' ? 'self' : model.costTier;
            var hiddenClass = idx >= initialShow ? 'hidden-rec' : '';
            var isTop = idx === 0;
            var overallScore = r.overallScore || Math.round(r.capabilityScore * 0.7 + r.valueScore * 0.3);
            var primaryScore = effectivePriority === 'best' ? overallScore : r.capabilityScore;
            var drivers = getTopDrivers(r.breakdown, 2);
            var incomplete = r.completeness < 0.5 ? '*' : '';

            return '<tr class="' + hiddenClass + '" onclick="openModelModal(\'' + model.id + '\')">' +
                '<td class="rank-cell ' + (isTop ? 'top' : '') + '">' + (idx + 1) + '</td>' +
                '<td class="model-cell">' + model.name + (isTop ? '<span class="badge">TOP PICK</span>' : '') +
                    '<div class="provider-sub">' + getProviderName(model.provider) + '</div></td>' +
                '<td class="score-cell"><span class="score-val">' + primaryScore + incomplete + '</span>' +
                    '<div class="score-bar-mini"><div class="fill ' + primaryClass + '" style="width:' + primaryScore + '%"></div></div></td>' +
                '<td class="score-cell"><span class="score-val">' + r.valueScore + '</span>' +
                    '<div class="score-bar-mini"><div class="fill efficiency" style="width:' + r.valueScore + '%"></div></div></td>' +
                '<td class="cost-cell"><span class="cost-badge cost-' + costClass + '">' + getCostLabel(model.costTier) + '</span></td>' +
                '<td class="drivers-cell">' + drivers.join(' · ') + '</td>' +
                '</tr>';
        }).join('');

        html += '</tbody></table>';

        if (hasMore) {
            html += '<button class="show-more-btn" onclick="toggleMoreRecs(this)">Show ' + (ranked.length - initialShow) + ' more</button>';
        }

        container.innerHTML = html;
    }

    function toggleMoreRecs(btn) {
        const container = btn.parentElement;
        const hiddenCards = container.querySelectorAll('.hidden-rec');
        const isExpanded = btn.dataset.expanded === 'true';

        hiddenCards.forEach(card => {
            if (isExpanded) {
                card.classList.remove('show');
            } else {
                card.classList.add('show');
            }
        });

        if (isExpanded) {
            btn.textContent = 'Show ' + hiddenCards.length + ' more';
            btn.dataset.expanded = 'false';
        } else {
            btn.textContent = 'Show fewer';
            btn.dataset.expanded = 'true';
        }
    }

    function openModelModal(modelId) {
        const model = getModelById(modelId);
        if (!model) return;
        const modal = document.getElementById('modelModal');
        document.getElementById('modalModelName').textContent = model.name;
        document.getElementById('modalProvider').textContent = getProviderName(model.provider);
        const costBadge = document.getElementById('modalCostBadge');
        costBadge.textContent = getCostLabel(model.costTier);
        costBadge.className = 'cost-badge cost-' + (model.costTier === 'self-hosted' ? 'self' : model.costTier);
        document.getElementById('modalOverview').textContent = model.overview || model.description;

        // Specs grid
        const specs = [
            { label: 'Context Window', value: formatTokenCount(model.contextWindow) },
            { label: 'Max Output', value: model.maxOutputTokens ? formatTokenCount(model.maxOutputTokens) : 'N/A' },
            { label: 'Multimodal', value: model.specs && model.specs.multimodal ? model.specs.multimodalTypes.join(', ') : 'Text only' },
            { label: 'Released', value: model.specs && model.specs.releaseDate ? model.specs.releaseDate : 'N/A' },
            { label: 'Training Cutoff', value: model.specs && model.specs.trainingDataCutoff ? model.specs.trainingDataCutoff : 'N/A' },
            { label: 'Availability', value: model.specs && model.specs.apiAvailability ? model.specs.apiAvailability : 'API' }
        ];
        document.getElementById('modalSpecs').innerHTML = specs.map(s =>
            '<div class="spec-card"><div class="spec-label">' + s.label + '</div><div class="spec-value">' + s.value + '</div></div>'
        ).join('');

        // Pricing
        const pricingEl = document.getElementById('modalPricing');
        if (model.pricing && model.pricing.inputPerMillion != null) {
            pricingEl.innerHTML =
                '<div class="pricing-item"><div class="pricing-label">Input / 1M tokens</div><div class="pricing-value">$' + model.pricing.inputPerMillion.toFixed(2) + '</div></div>' +
                '<div class="pricing-item"><div class="pricing-label">Output / 1M tokens</div><div class="pricing-value">$' + model.pricing.outputPerMillion.toFixed(2) + '</div></div>' +
                (model.pricing.notes ? '<div class="pricing-item"><div class="pricing-label">Note</div><div style="color:#aaa;font-size:0.85rem">' + model.pricing.notes + '</div></div>' : '');
            document.getElementById('modalPricingSection').style.display = '';
        } else {
            pricingEl.innerHTML = '<div class="pricing-item"><div class="pricing-value" style="color:#aaa;font-size:0.95rem">Self-hosted - cost depends on your infrastructure</div></div>';
            document.getElementById('modalPricingSection').style.display = '';
        }

        // Strengths
        document.getElementById('modalStrengths').innerHTML = (model.strengths || []).map(s => '<li>' + s + '</li>').join('') || '<li style="color:#888">No detailed data available</li>';

        // Weaknesses
        document.getElementById('modalWeaknesses').innerHTML = (model.weaknesses || []).map(w => '<li>' + w + '</li>').join('') || '<li style="color:#888">No detailed data available</li>';

        // Use cases
        const ucEl = document.getElementById('modalUseCases');
        if (model.useCaseDetails && model.useCaseDetails.length > 0) {
            ucEl.innerHTML = model.useCaseDetails.map(uc =>
                '<div class="use-case-item"><h4>' + uc.name + '</h4><p>' + uc.explanation + '</p></div>'
            ).join('');
            document.getElementById('modalUseCasesSection').style.display = '';
        } else {
            ucEl.innerHTML = '<p style="color:#888">Best for: ' + (model.bestFor || []).join(', ') + '</p>';
            document.getElementById('modalUseCasesSection').style.display = '';
        }

        // Benchmarks
        const benchEl = document.getElementById('modalBenchmarks');
        const benchNames = { sweBenchVerified: 'SWE-bench', mmlu: 'MMLU', gpqaDiamond: 'GPQA Diamond', aime2024: 'AIME 2024', lmarenaElo: 'LMArena Elo' };
        const benchEntries = Object.entries(model.benchmarks || {}).filter(([k, v]) => v != null);
        if (benchEntries.length > 0) {
            benchEl.innerHTML = benchEntries.map(([k, v]) =>
                '<div class="benchmark-chip"><div class="bench-name">' + (benchNames[k] || k) + '</div><div class="bench-value">' + v + (typeof v === 'number' && v <= 100 && k !== 'lmarenaElo' ? '%' : '') + '</div></div>'
            ).join('');
            document.getElementById('modalBenchmarksSection').style.display = '';
        } else {
            document.getElementById('modalBenchmarksSection').style.display = 'none';
        }

        // Tags
        document.getElementById('modalTags').innerHTML = (model.bestFor || []).map(t => '<span class="modal-tag">' + t + '</span>').join('');

        // Source URLs
        const sourcesEl = document.getElementById('modalSources');
        const sourceLabels = {
            pricing: 'Pricing',
            docs: 'Documentation',
            announcement: 'Announcement',
            guide: 'Developer Guide',
            github: 'GitHub',
            huggingface: 'HuggingFace',
            benchmarks: 'Benchmarks'
        };
        if (model.sourceUrls && Object.keys(model.sourceUrls).length > 0) {
            sourcesEl.innerHTML = Object.entries(model.sourceUrls).map(([key, url]) =>
                '<a href="' + url + '" target="_blank" rel="noopener" class="source-link">' +
                (sourceLabels[key] || key) + ' <span class="source-icon">↗</span></a>'
            ).join('');
            document.getElementById('modalSourcesSection').style.display = '';
        } else {
            // Fall back to provider URLs if no model-specific sources
            const provider = modelData.providers[model.provider];
            if (provider && (provider.docsUrl || provider.pricingUrl)) {
                let html = '';
                if (provider.pricingUrl) html += '<a href="' + provider.pricingUrl + '" target="_blank" rel="noopener" class="source-link">Provider Pricing <span class="source-icon">↗</span></a>';
                if (provider.docsUrl) html += '<a href="' + provider.docsUrl + '" target="_blank" rel="noopener" class="source-link">Provider Docs <span class="source-icon">↗</span></a>';
                sourcesEl.innerHTML = html;
                document.getElementById('modalSourcesSection').style.display = '';
            } else {
                document.getElementById('modalSourcesSection').style.display = 'none';
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModelModal() {
        document.getElementById('modelModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMethodologyModal() {
        document.getElementById('methodologyModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMethodologyModal() {
        document.getElementById('methodologyModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add methodology modal close handlers
    document.getElementById('methodologyModal').addEventListener('click', function(e) {
        if (e.target === this) closeMethodologyModal();
    });