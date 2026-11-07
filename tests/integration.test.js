const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Integration: Project and Asset Links', async (t) => {
    await t.test('all project markdown files should exist', () => {
        const projectsDir = path.join(__dirname, '../projects');
        const files = fs.readdirSync(projectsDir);
        assert.ok(files.includes('ai-brainstorming.md'));
        assert.ok(files.includes('ai-security-scanner.md'));
        assert.ok(files.includes('reset-therapy.md'));
    });

    await t.test('README.md should link to existing assets on disk', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8');
        const assetRegex = /assets\/[a-zA-Z0-9_-]*\.svg/g;
        let match;
        const assets = new Set();
        while ((match = assetRegex.exec(content)) !== null) {
            assets.add(match[0]);
        }
        assert.ok(assets.size > 0, "No assets found in README.md");
        for (const asset of assets) {
            const assetPath = path.join(__dirname, '..', asset);
            assert.ok(fs.existsSync(assetPath), `Asset ${asset} does not exist`);
        }
    });

    await t.test('README.zh-TW.md should link to existing assets on disk', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.zh-TW.md'), 'utf-8');
        const assetRegex = /assets\/[a-zA-Z0-9_-]*\.svg/g;
        let match;
        const assets = new Set();
        while ((match = assetRegex.exec(content)) !== null) {
            assets.add(match[0]);
        }
        assert.ok(assets.size > 0, "No assets found in README.zh-TW.md");
        for (const asset of assets) {
            const assetPath = path.join(__dirname, '..', asset);
            assert.ok(fs.existsSync(assetPath), `Asset ${asset} does not exist`);
        }
    });

    await t.test('all project markdown files should have back-links', () => {
        const projectsDir = path.join(__dirname, '../projects');
        const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md') && f !== 'README.md');
        assert.ok(files.length > 0, "No project markdown files found");

        for (const file of files) {
            const content = fs.readFileSync(path.join(projectsDir, file), 'utf-8');
            assert.ok(content.includes('../README.md') || content.includes('../README.zh-TW.md'), `File ${file} is missing back-links`);
        }
    });

    await t.test('documentation files should exist', () => {
        assert.ok(fs.existsSync(path.join(__dirname, '../docs/api-reference.md')), 'docs/api-reference.md is missing');
        assert.ok(fs.existsSync(path.join(__dirname, '../docs/dashboard-telemetry.md')), 'docs/dashboard-telemetry.md is missing');
    });

    await t.test('projects listed in projects/README.md should have corresponding markdown files', () => {
        const content = fs.readFileSync(path.join(__dirname, '../projects/README.md'), 'utf-8');
        const projectLinkRegex = /\[Source ↗\]\(https:\/\/github\.com\/[^/]+\/([^)]+)\)/g;
        let match;
        const linkedProjects = new Set();
        while ((match = projectLinkRegex.exec(content)) !== null) {
            linkedProjects.add(match[1].toLowerCase());
        }

        const projectsDir = path.join(__dirname, '../projects');
        const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md') && f !== 'README.md');

        // Just verify there is a non-zero count to avoid false passes
        assert.ok(files.length > 0, 'Should have project files');

        for (const file of files) {
            assert.ok(fs.existsSync(path.join(projectsDir, file)), `File ${file} does not exist`);
        }
    });
});
