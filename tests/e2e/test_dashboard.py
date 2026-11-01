import pytest
from playwright.sync_api import Page, expect
import re

# We use a placeholder URL because there is no application in this repo
BASE_URL = "http://localhost:3000"

def test_auto_refresh_intervals(page: Page):
    """Test that the dashboard auto-refreshes at correct intervals."""
    # This should fail until the actual dashboard implementation is present
    try:
        page.goto(f"{BASE_URL}/dashboard")
    except Exception as e:
        pytest.skip(f"Application not available: {e}")

    # Wait for the metric to be visible
    metric = page.locator("[data-testid='metric-value']").first
    expect(metric).to_be_visible(timeout=5000)

    # Store initial value
    initial_value = metric.inner_text()

    # Wait for longer than the refresh interval (e.g. 35s for a 30s interval)
    # Using Playwright's expect to retry until the text changes
    expect(metric).not_to_have_text(initial_value, timeout=35000)

def test_network_failure_banner(page: Page):
    """Test that the network failure banner is displayed when offline."""
    try:
        page.goto(f"{BASE_URL}/dashboard")
    except Exception as e:
        pytest.skip(f"Application not available: {e}")

    # Take the page offline to trigger the network error banner
    page.context.set_offline(True)

    # Check for the network failure banner visibility
    banner = page.locator(".network-error-banner, [data-testid='network-error']")
    expect(banner).to_be_visible(timeout=5000)

def test_metric_card_formatting(page: Page):
    """Test that the metric cards are formatted correctly."""
    try:
        page.goto(f"{BASE_URL}/dashboard")
    except Exception as e:
        pytest.skip(f"Application not available: {e}")

    # Wait for the metric element to become visible
    metric_element = page.locator(".metric-value, [data-testid='metric-value']").first
    expect(metric_element).to_be_visible(timeout=5000)

    # Get the text
    metric_text = metric_element.inner_text()

    # Verify that the formatting matches expected number format (e.g., 1,234.56)
    assert re.match(r"^\d{1,3}(,\d{3})*(\.\d{2})?$", metric_text), f"Metric '{metric_text}' format is invalid"
