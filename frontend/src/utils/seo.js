// SEO utility functions for dynamic meta tags and structured data

export const updateMetaTags = ({ title, description, keywords, ogType = 'website', ogImage, canonical }) => {
  document.title = title;
  
  const metaTags = [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
    { property: 'og:url', content: canonical || window.location.href },
    { property: 'og:site_name', content: 'StackIT' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large' },
    { name: 'googlebot', content: 'index, follow' }
  ];

  if (ogImage) {
    metaTags.push(
      { property: 'og:image', content: ogImage },
      { name: 'twitter:image', content: ogImage }
    );
  }

  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let element = document.querySelector(selector);
    
    if (!element) {
      element = document.createElement('meta');
      if (name) element.setAttribute('name', name);
      if (property) element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  });

  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonical || window.location.href);
};

export const addStructuredData = (data) => {
  const scriptId = 'structured-data';
  let script = document.getElementById(scriptId);
  
  if (script) script.remove();
  
  script = document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

export const generateQASchema = (question, answers = []) => ({
  "@context": "https://schema.org",
  "@type": "QAPage",
  "mainEntity": {
    "@type": "Question",
    "name": question.title,
    "text": question.description,
    "answerCount": answers.length,
    "upvoteCount": question.votes?.upvotes?.length || 0,
    "dateCreated": question.createdAt,
    "author": {
      "@type": "Person",
      "name": question.author?.name || "Anonymous"
    }
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "StackIT",
  "description": "A minimal Q&A platform for modern learners",
  "url": window.location.origin,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${window.location.origin}/questions?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});
