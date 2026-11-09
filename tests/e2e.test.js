const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('E2E: Profile pages and navigation', async (t) => {
    await t.test('README.md should contain navigation to projects', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8');
        assert.ok(content.includes('projects/README.md') || content.includes('All 23 project pages'));
    });

    await t.test('README.zh-TW.md should contain navigation to projects in Chinese', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.zh-TW.md'), 'utf-8');
        assert.ok(content.includes('projects/README.md') || content.includes('全部 23 個專案'));
    });

    await t.test('README.md should link to README.zh-TW.md', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8');
        assert.ok(content.includes('README.zh-TW.md'));
    });

    await t.test('README.zh-TW.md should link to README.md', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.zh-TW.md'), 'utf-8');
        assert.ok(content.includes('README.md'));
    });

    await t.test('projects/README.md should contain navigation back to root README', () => {
        const content = fs.readFileSync(path.join(__dirname, '../projects/README.md'), 'utf-8');
        assert.ok(content.includes('../README.md'));
        assert.ok(content.includes('../README.zh-TW.md') || content.includes('繁體中文'));
    });

    await t.test('README.zh-TW.md structure should match README.md', () => {
        const enContent = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8');
        const twContent = fs.readFileSync(path.join(__dirname, '../README.zh-TW.md'), 'utf-8');

        // Count headers
        const getHeaderCount = (content) => (content.match(/^## /gm) || []).length;
        assert.strictEqual(getHeaderCount(twContent), getHeaderCount(enContent), 'Header count mismatch between languages');

        // Extract and compare project names (assuming they're inside <strong><a href="..."> tags)
        const getProjectNames = (content) => {
            const matches = content.match(/<strong><a href="[^"]+">([^<]+)<\/a><\/strong>/g) || [];
            return matches.map(match => match.replace(/<strong><a href="[^"]+">([^<]+)<\/a><\/strong>/, '$1'));
        };
        const enProjects = getProjectNames(enContent);
        const twProjects = getProjectNames(twContent);

        // We know from the repository there are 23 projects mentioned.
        assert.ok(enProjects.length >= 23, `Expected at least 23 projects, found ${enProjects.length} in English README`);
        assert.strictEqual(twProjects.length, enProjects.length, 'Project count mismatch between languages');
    });
});
