import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({
  title = "StackIT - Community-Driven Q&A Platform for Developers and Learners",
  description = "Join StackIT, the collaborative Q&A platform where developers, students, and learners share knowledge, ask questions, and grow together. Get expert answers on programming, technology, and more.",
  keywords = "Q&A platform, programming questions, developer community, coding help, tech support, knowledge sharing, Stack Overflow alternative, programming forum, developer forum, coding community",
  image = "https://odoo.dhruv210.in/src/assets/img/StackIT-LOGO.png",
  type = "website"
}) => {
  const location = useLocation();
  const currentUrl = `https://odoo.dhruv210.in${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', currentUrl, true);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', currentUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', currentUrl);
      document.head.appendChild(canonical);
    }
  }, [title, description, keywords, image, type, currentUrl]);

  return null;
};

export default SEO;