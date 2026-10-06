/**
 * Cookscape Unified Analytics & Conversion Tracking Utility
 * Handles Google Ads (gtag.js) Conversion Tracking and Meta Pixel (fbq) Events.
 */

export const GOOGLE_ADS_ID = 'AW-18450663698';
export const GOOGLE_ADS_CONVERSION_LABEL = 'AW-18450663698/e9gMCLmfjlYdEJKS-91E';
export const META_PIXEL_ID = '28289209510689100';

/**
 * Tracks a Lead conversion across Google Ads and Meta Pixel.
 * Uses Google Ads Enhanced Conversions when user data is provided.
 * 
 * @param {Object} options
 * @param {string} [options.name=''] - Customer name
 * @param {string} [options.email=''] - Customer email address
 * @param {string} [options.phone=''] - Customer phone number
 * @param {string} [options.source='Lead Form'] - Form or lead source identifier
 * @param {number} [options.value=1.0] - Conversion monetary value
 * @param {string} [options.currency='INR'] - Currency code
 */
export function trackLeadConversion({
  name = '',
  email = '',
  phone = '',
  location = '',
  houseType = '',
  bhk = '',
  source = 'Lead Form',
  value = 1.0,
  currency = 'INR'
} = {}) {
  let googleAdsSuccess = false;
  let metaPixelSuccess = false;

  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';

  // 1. Google Ads Conversion Tracking
  if (typeof window.gtag === 'function') {
    try {
      // Enhanced Conversions: send normalized first-party user data
      if (cleanEmail || cleanPhone) {
        const userData = {};
        if (cleanEmail) userData.email = cleanEmail;
        if (cleanPhone) userData.phone_number = cleanPhone;

        const address = {};
        if (name && name.trim()) {
          const parts = name.trim().split(/\s+/);
          address.first_name = parts[0] || '';
          address.last_name = parts.slice(1).join(' ') || '';
        }
        if (location && location.trim()) {
          address.city = location.trim();
          address.country = 'IN';
        }
        if (Object.keys(address).length > 0) {
          userData.address = address;
        }

        window.gtag('set', 'user_data', userData);
      }

      // Fire conversion event directly
      window.gtag('event', 'conversion', {
        send_to: GOOGLE_ADS_CONVERSION_LABEL,
        value: value,
        currency: currency,
        event_category: 'Lead',
        event_label: source,
        lead_location: location,
        property_type: houseType,
        bhk_type: bhk
      });

      googleAdsSuccess = true;
      console.log(
        `%c[Google Ads]%c Lead Conversion fired successfully 🎯\n  Send to: ${GOOGLE_ADS_CONVERSION_LABEL}\n  Source: ${source}\n  Location: ${location || 'N/A'}\n  Property: ${houseType || 'N/A'} (${bhk || 'N/A'})\n  Value: ${value} ${currency}`,
        'background: #1a73e8; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'color: inherit;'
      );
    } catch (err) {
      console.error('[Google Ads] Failed to track conversion:', err);
    }
  } else {
    console.warn(
      '[Google Ads] window.gtag is not available. Please verify that https://www.googletagmanager.com/gtag/js?id=' +
        GOOGLE_ADS_ID +
        ' is not blocked by browser extensions/ad blockers.'
    );
  }

  // Fallback to window.gtag_report_conversion if defined
  if (!googleAdsSuccess && typeof window.gtag_report_conversion === 'function') {
    try {
      window.gtag_report_conversion();
      googleAdsSuccess = true;
      console.log('[Google Ads] Fallback gtag_report_conversion executed.');
    } catch (err) {
      console.error('[Google Ads] Fallback execution failed:', err);
    }
  }

  // 2. Meta Pixel (fbq) Lead Tracking
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('track', 'Lead', {
        content_name: source,
        currency: currency,
        value: value,
        property_type: houseType,
        bhk: bhk,
        location: location
      });
      metaPixelSuccess = true;
      console.log(
        `%c[Meta Pixel]%c Lead event fired successfully 🚀\n  Content: ${source}\n  Location: ${location || 'N/A'}\n  Type: ${houseType || 'N/A'} - ${bhk || 'N/A'}`,
        'background: #1877f2; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
        'color: inherit;'
      );
    } catch (err) {
      console.error('[Meta Pixel] Failed to track lead event:', err);
    }
  } else {
    console.warn('[Meta Pixel] window.fbq is not available. Meta pixel script may be blocked.');
  }

  return { googleAdsSuccess, metaPixelSuccess };
}

/**
 * Tracks Contact Actions (e.g. WhatsApp, Phone call)
 */
export function trackContactAction(channelName = 'WhatsApp') {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', {
      content_name: channelName
    });
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'contact_click', {
      event_category: 'Contact',
      event_label: channelName
    });
  }
  console.log(`[Analytics] Contact action tracked: ${channelName}`);
}

/**
 * Tracks Single Page Application (SPA) PageViews
 */
export function trackPageView(path) {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GOOGLE_ADS_ID, {
      page_path: path
    });
  }
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
}
