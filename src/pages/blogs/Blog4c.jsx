import React from 'react';
import { Helmet } from 'react-helmet-async';
const interior = '/logo.jpeg';
const blog33 = '/blog-images/cookscape-blog-33.webp';
const ararvindh = '/architects/Cookscape-Architect-Arvindh.webp';
const Blog4c = () => {
return (
<>
<Helmet>
<title> Cookscape - Interior Designer in Chennai, Modular Kitchen Designer in Chennai, Wardrobe Designer in Chennai, Home Renovation in Chennai, TV Unit in  Chennai, Kitchen Cabinet Designs In Chennai  </title>
<meta name="keywords" content="interior designers in Chennai, modular kitchen in Chennai, interior decorators in Chennai, kitchen designers in Chennai, bedroom wardrobe designers in Chennai, home renovation in Chennai, remodeling in Chennai, kitchen renovators in Chennai, living room interior decor in Chennai, dining room interior designers in Chennai, home interior decors in Chennai, interior design company in Chennai, interior design ideas in Chennai, kitchen interior ideas in Chennai, pooja room interior designers in Chennai, kitchen cabinet designs in Chennai"/>
<meta name="description" content="Cookscape offers expert interior design services, including modular kitchens, pooja units, wardrobes, TV units, kids' furniture, and more.
"/>
<meta name='copyright' content='Cookscape'/>
<meta name='language' content='IN'/>
<meta name='robots' content='index,follow'/>
<meta name='topic' content='Business'/>
<meta name='Classification' content='Interior Designer'/>
<meta name='author' content='info@cookscape.com'/>
<meta name='designer' content='Cookscape India Private Limited'/>
<meta name='reply-to' content='Cookscape'/>
<meta name='owner' content='Cookscape India Private Limited'/>
<link rel="canonical" href="https://www.cookscape.com/what-is-4x-tuff-gloss-variant"></link>
</Helmet>
<div className="container-fluid services-breadcrumb">
                    <h3 className="cookscape-services-title">Cookscape Blog</h3>
</div>
<div className='container-fluid aboutus'>
                  <div className='container p-5'>
                      <h1 className='blog-page-title pt-3'>What is 4X Tuff Gloss Variant?</h1>
                      <img src={blog33} alt="cookscape-4xtuff-gloss-variant" className="img-fluid pt-3"/>
                      <p className='blog-page-para'>This has it all from beauty to stain resistant finish to a timeless appeal. Its thick and glossy laminate never fades and makes the kitchen look new for ages. 4x tuff gloss as the name suggest has an exterior shutter with 4 layers of glossy finish. This makes the variant not just stain resistant but also scratch proof. It has about 50-60 different varieties of colors to choose from.</p>
                      <h2 className='blog-page-title-2 pt-3'>Key Points & Features:</h2>
                      <p className='blog-page-para'>• Highlight – Very Elegant, Stain Proof & long lasting – One of our most sought after Variant</p>
                      <p className='blog-page-para'>• Kitchen Carcass Boiling Water Proof (BWP) – IS710 Grade</p>
                      <p className='blog-page-para'>• Wardrobe Carcass: Boiling Water Proof (BWP) – IS710 Grade</p>
                      <p className='blog-page-para'>• Shutter Material: High Density High Moisture Resistance- HDHMR (Exterior Grade)</p>
                      <p className='blog-page-para'>• Shutter Finish: 1.2 mm Tough Gloss / Scratch Proof</p>
                      <p className='blog-page-para'>• Laminate Brand: Merino MR + / Royal Touch</p>
                      <p className='blog-page-para'>• Primary Hardware: EBCO (12 Kg)</p>
                      <p className='blog-page-para'>Skirting: Matching SF Skirting / Rehau Skirting</p>
                      <img src={ararvindh} alt="Architect-Arvindh" className="blog-page-author-img pt-3"/>
                      <h1 className='blog-title pt-3'>Architect Arvindh</h1>
                    </div>
</div>
<div className="modal fade" id="verticalModal" tabIndex="-1" aria-labelledby="verticalModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
          <img src={interior} alt="cookscape-interior-designs" className="img-fluid rounded pb-1"/>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Get free design Catalogue</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
            <div className="contact-form-container">
                    <form id="contactForm" method="post" action="https://www.cookscape.com/static/mail.php">
                    <div className="row">
                                    <div className="col-12">
                                        <div className="alert alert-success contact__msg_short" style={{display: "none"}} role="alert">
                                            Your message was sent successfully.
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 form-group">
                                        <input name="name" type="text" className="form-control" placeholder="Name" required/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <input name="email" type="email" className="form-control" placeholder="Email" required/>
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <input name="phone" type="text" className="form-control" placeholder="Phone" required/>
                                    </div>
                                    <div className="col-12">
                                        <input name="submit" type="submit" className="btn btn-success" value="Send Message"/>
                                    </div>
                                </div>
                    </form>
                  </div>
            </div>
            
          </div>
        </div>
</div>
</>
              );
            };
export default Blog4c;
