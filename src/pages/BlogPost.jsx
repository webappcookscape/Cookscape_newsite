import React, { Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { blogs } from '../data/blogsData';
import blogSeoData from '../data/blogSeoData';

const blogsModules = import.meta.glob('./blogs/*.jsx');

const BlogPost = () => {
  const { id } = useParams();
  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="blogpost-not-found">
        <Helmet>
          <title>Blog Post Not Found | Cookscape</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="container">
          <h2>Blog post not found</h2>
          <p>The story you're looking for doesn't exist or has been moved.</p>
          <Link to="/blog" className="blogpost-back-btn">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const seo = blogSeoData[blog.id] || {};
  const pageTitle = seo.seoTitle || `${blog.title} | Cookscape Blog`;
  const pageDescription = seo.seoDescription || blog.excerpt?.substring(0, 160) || 'Read this interior design article from Cookscape experts.';
  const canonicalUrl = `https://cookscape.in/blog/${blog.id}`;
  const ogImage = blog.image?.startsWith('http') ? blog.image : `https://cookscape.in${blog.image}`;
  const shareUrl = encodeURIComponent(canonicalUrl);
  const shareTitle = encodeURIComponent(pageTitle);

  const componentPath = `./blogs/${blog.file}`;
  const ContentComponent = blogsModules[componentPath]
    ? lazy(blogsModules[componentPath])
    : null;

  if (!ContentComponent) {
    return <div className="container" style={{ padding: '200px 0' }}>Content not found at {componentPath}</div>;
  }

  return (
    <div className="blogpost-premium-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph — Article */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Cookscape Interiors" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={blog.title} />
        <meta property="og:locale" content="en_IN" />
        <meta property="article:author" content={`Architect ${blog.author}`} />
        <meta property="article:publisher" content="https://www.facebook.com/cookscape/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Article JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": pageDescription,
            "image": ogImage,
            "url": canonicalUrl,
            "author": {
              "@type": "Person",
              "name": `Architect ${blog.author}`,
              "worksFor": {
                "@type": "Organization",
                "name": "Cookscape Interiors",
                "url": "https://cookscape.in"
              }
            },
            "publisher": {
              "@type": "Organization",
              "name": "Cookscape Interiors",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cookscape.in/logo.jpeg"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonicalUrl
            },
            "inLanguage": "en-IN",
            "about": {
              "@type": "Thing",
              "name": "Interior Design"
            }
          })}
        </script>
      </Helmet>

      <Suspense fallback={
        <div className="blogpost-loader">
          <div className="loader-pulse"></div>
          <p>Loading story...</p>
        </div>
      }>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ContentComponent />
        </motion.div>
      </Suspense>

      <div className="container blogpost-footer-section">
        <div className="blogpost-divider"></div>
        <div className="blogpost-footer-actions">
          <Link to="/blog" className="blogpost-back-link">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to All Stories
          </Link>
          <div className="blogpost-share-group">
            <span>Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              aria-label="Share on Facebook"
            >Fb</a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              aria-label="Share on LinkedIn"
            >In</a>
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="share-btn"
              aria-label="Share on Twitter"
            >Tw</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

