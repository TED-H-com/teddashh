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
});
