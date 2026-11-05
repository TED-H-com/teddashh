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
});
