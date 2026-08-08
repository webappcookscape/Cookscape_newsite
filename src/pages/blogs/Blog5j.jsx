import React from 'react';
import { Helmet } from 'react-helmet-async';
const interior = '/logo.jpeg';
const blog50 = '/blog-images/cookscape-blog-50.webp';
const argomathi = '/architects/Cookscape-Architect-Gomathi-Varshini.webp';
const Blog5j = () => {
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
<link rel="canonical" href="https://www.cookscape.com/stay-updated-with-the-latest-design-trends"></link>
</Helmet>
<div className="container-fluid services-breadcrumb">
                    <h3 className="cookscape-services-title">Cookscape Blog</h3>
</div>
<div className='container-fluid aboutus'>
                    <div className='container p-5'>
                        <h1 className='blog-page-title pt-3'>Stay-updated-with-the-latest-design-trends!</h1>
                        <img src={blog50} alt="cookscape-latest-design" className="img-fluid pt-3"/>
                        <p className='blog-page-para'>The interior design industry is now updated in all aspects. Be prepared to re decorate your Interiors with the following trends.</p>
                        <p className='blog-page-para'>“A room should never allow the eye to settle in one place. It should smile at you and create fantasy” – Juan Montoya </p>
                        <h2 className='blog-page-title-2 pt-3'>Bold and Beautiful</h2>
                        <p className='blog-page-para'>Add a playful mix of vibrant colours, textures, patterns and decors. Addition of a bold colour to the light colour room gives your home a new life than the neutral or cool tones such as grey, white and black that has served us the past.</p>
                        <h2 className='blog-page-title-2 pt-3'>Accent walls</h2>
                        <p className='blog-page-para'>A wall that stands out from the other walls creates a distraction and naturally draws the eyes when entering the space. Choose a plain wall without openings in the room and highlight it with elements like wall papers, Textures, Pannelling, Cladding , patch of green or a photo gallery that recites the story of the family or the travel experience of the people of the house. </p>
                        <h2 className='blog-page-title-2 pt-3'>Appealing Antiques</h2>
                        <p className='blog-page-para'>Few antique displays in the house creates a contrast and enhances the particular space. Antiques als act as an important aesthetic element. The antiques creates an accent in the house. A small piece of antique furniture in the house can be a lovely addition to the house. Antiques gives a style statement to the space.</p>
                        <h2 className='blog-page-title-2 pt-3'>Stylish Seating</h2>
                        <p className='blog-page-para'>The living space reflects the culture and value of the family and the space creates first impression to the guests entering the house . The most important element is the seating. Choose a seating that creates a statement to the living area and creates a great impression to the guests entering the house. Choose a seating that is visually appealing and also comfortable.</p>
                        <h2 className='blog-page-title-2 pt-3'>Wallpapers</h2>
                        <p className='blog-page-para'>Create some drama in the room by replacing the boring plain walls with personalized wall papers that depicts your style. These bold geometrics creates an everlasting impression. These elements reinvest our spaces. Choose a wall paper from the n number of types like abstract for art lovers, nature inspired wall papers, textured wall papers, bold patterned wall paper.</p>
                        <h2 className='blog-page-title-2 pt-3'>Graceful Greens</h2>
                        <p className='blog-page-para'>The most inexpensive way to add glamour and colour to interiors is by incorporating some indoor plants. A patch of green at home gives an added advantage that is said to bing good vibes, purifies air, acts as a focal point and will act as an acoustic element.</p>
                        <p className='blog-page-para'>These greens can be added by creating a green wall using mosses, hanging flower pots, racking plants to create a green partition or a simple planter box at the dead spaces.</p>
                        <img src={argomathi} alt="Architect-Gomathi-Varshini" className="blog-page-author-img pt-3"/>
                        <h1 className='blog-title pt-3'>Architect Gomathi Varshini</h1>
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
export default Blog5j;
