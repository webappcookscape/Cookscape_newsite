import React from 'react';
import { Helmet } from 'react-helmet-async';
const interior = '/logo.jpeg';
const blog27 = '/blog-images/cookscape-blog-27.webp';
const arsaranya = '/architects/Cookscape-Architect-Saranya.webp';
const Blog3g = () => {
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
<link rel="canonical" href="https://www.cookscape.com/what-is-amaryllis-variant"></link>
</Helmet>
<div className="container-fluid services-breadcrumb">
                    <h3 className="cookscape-services-title">Cookscape Blog</h3>
</div>
<div className='container-fluid aboutus'>
                    <div className='container p-5'>
                        <h1 className='blog-page-title pt-3'>What is Amaryllis Variant?</h1>
                        <img src={blog27} alt="cookscape-amaryllis-variant" className="img-fluid pt-3"/>
                        <p className='blog-page-para'>Lustrous, handle-less, lacquered glass, frames and accessories are all set to breathe new life into interiors, transforming them into elegant showcases of beauty. This variant has metallic shutters frames made up of aluminum alloy the frame is on lacquered glass, which comes in various solid and bright colors.</p>
                        <h2 className='blog-page-title-2 pt-3'>Key Points & Features:</h2>
                        <p className='blog-page-para'>• Highlight – Luxurious Lacquered Glass finish with Imported Metal Frames</p>
                        <p className='blog-page-para'>• Kitchen Carcass Boiling Water Proof (BWP) – IS710 Grade</p>
                        <p className='blog-page-para'>• Wardrobe Carcass: Boiling Water Proof (BWP) – IS710 Grade</p>
                        <p className='blog-page-para'>• Shutter Material: Lacquered Glass – Ashahi Brand</p>
                        <p className='blog-page-para'>• Shutter Finish: Aluminum Alloy Frames – Lacquered Glass</p>
                        <p className='blog-page-para'>• Frames: Zumila Frames 2 mm beading</p>
                        <p className='blog-page-para'>• Primary Hardware: EBCO (12 Kg)</p>
                        <p className='blog-page-para'>• Skirting: Matching SF Skirting / Rehau Skirting</p>
                        <img src={arsaranya} alt="Architect-Saranya" className="blog-page-author-img pt-3"/>
                        <h1 className='blog-title pt-3'>Architect Saranya</h1>
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
export default Blog3g;
