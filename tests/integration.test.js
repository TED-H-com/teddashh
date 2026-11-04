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

    await t.test('README.md should link to existing assets', () => {
        const content = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf-8');
        assert.ok(content.includes('./assets/profile-hero-light.svg'));

        const heroLightExists = fs.existsSync(path.join(__dirname, '../assets/profile-hero-light.svg'));
        assert.ok(heroLightExists);
    });
});
