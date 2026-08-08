import React from 'react';
import { Helmet } from 'react-helmet-async';
const interior = '/logo.jpeg';
const blog36 = '/blog-images/cookscape-blog-36.webp';
const arsaranya = '/architects/Cookscape-Architect-Saranya.webp';
const Blog4g = () => {
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
<link rel="canonical" href="https://www.cookscape.com/what-is-capricoast-glossy-variant"></link>
</Helmet>
<div className="container-fluid services-breadcrumb">
                    <h3 className="cookscape-services-title">Cookscape Blog</h3>
</div>
<div className='container-fluid aboutus'>
                    <div className='container p-5'>
                        <h1 className='blog-page-title pt-3'>What is Capricoast Glossy Variant?</h1>
                        <img src={blog36} alt="cookscape-glossy-variant" className="img-fluid pt-3"/>
                        <p className='blog-page-para'>A special variety of laminate. Its shiny texture creates bright & lovely spaces. Although it has luxurious appeal it is most suitable for modest budgets. It comes with 10 year repair warranty and thus Kitchen Carcass of this material is made up of Boiling Water Proof Material with the necessary treatments applied on it. However all the other woodwork carcass contains Boiling Water Resistant variant and same holds true for the Shutter Material as well. It has a 0.8mm thick glossy laminate which has an aesthetic appeal and a modest pricing. It has over 40 to 50 different color shades available to choose from.</p>
                        <h2 className='blog-page-title-2 pt-3'>Key Points & Features:</h2>
                        <p className='blog-page-para'>• Highlight – Grand Glossy Look</p>
                        <p className='blog-page-para'>• Kitchen Carcass Boiling Water Proof (BWP) – IS710 Grade</p>
                        <p className='blog-page-para'>• Kitchen Shutter Boiling Water Proof (BWP) – IS710 Grade</p>
                        <p className='blog-page-para'>• Wardrobe Carcass: Boiling Water Resistance (BWR)</p>
                        <p className='blog-page-para'>• Wardrobe Shutter: Boiling Water Resistance (BWR)</p>
                        <p className='blog-page-para'>• Shutter Finish: Glossy</p>
                        <p className='blog-page-para'>Laminate Brand: Prelam / Virgo / Formica / Calplus Series</p>
                        <p className='blog-page-para'>Primary Hardware: EBCO / HETTICH</p>
                        <p className='blog-page-para'>Skirting: EBCO PVC Skirting / Wooden Skirting</p>
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
export default Blog4g;
