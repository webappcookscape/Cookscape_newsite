import React, { Component } from "react";
import { FAQs } from "../data/FAQs"; // Importing FAQs from a JSON file for better maintainability

const totalFaqs = FAQs.length;
const Arrow = ({ up = false }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d={up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
  </svg>
);

const FAQ_BATCH_SIZE = 5;

export class FAQ extends Component {
  faqSectionRef = React.createRef();
  state = {
    activeIndex: null,
    visibleCount: FAQ_BATCH_SIZE,
  };
  toggleFAQ = (id) => {
    this.setState((prevState) => ({
      activeIndex: prevState.isActive ? null : id,
    }));
  };
  
  loadMore = () => {
    this.setState((prevState) => ({
      visibleCount: Math.min(
        prevState.visibleCount + FAQ_BATCH_SIZE,
        FAQs.length,
      ),
    }));
  };
  showLess = () => {
    this.setState({
      visibleCount: FAQ_BATCH_SIZE,
      activeIndex: null,
    });
    
    // Optional: Smooth scroll back to FAQ
    this.faqSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  render() {
    const { activeIndex, visibleCount } = this.state;
    const visibleFaqs = FAQs.slice(0, visibleCount);
    
    return (
      <section className="faq-section" ref={this.faqSectionRef}>
        <div className="faq-container">
          {/* Heading */}
          <div className="faq-heading">
            <span className="faq-highlight">FAQ</span>

            <h2>
              Everything You Need to <span>Know</span>
            </h2>

            <p>
              Find answers to the most frequently asked questions about our
              interior design services, process, pricing, and project timeline.
            </p>
          </div>

          {/* FAQ List */}
          <div className="faq-list">
            {visibleFaqs.map(({ id, question, answer }) => {
              const isActive = activeIndex === id;
              return (
                <div
                  key={id}
                  className={`faq-card ${isActive ? "active" : ""}`}
                >
                  <button
                    className="faq-question"
                    onClick={() => this.toggleFAQ(id)}
                    aria-expanded={isActive}
                    aria-controls={`faq-${id}`}
                  >
                    <span>
                      {id}. {question}
                    </span>

                    <span className={`faq-icon ${isActive ? "rotate" : ""}`}>
                      +
                    </span>
                  </button>

                  <div className={`faq-answer ${isActive ? "show" : ""}`}>
                    <p>{answer}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div className="faq-load-more">
            {visibleCount < totalFaqs ? (
              <button
                className="btn-primary-v3 show-more-btn"
                onClick={this.loadMore}
              >
                View More FAQs <Arrow />
              </button>
            ) : (
              <button
                className="btn-primary-v3 show-less-btn"
                onClick={this.showLess}
              >
                Show Less
                <Arrow up />
              </button>
            )}
          </div>

          {/* CTA */}
          {/* <div className="faq-cta">

            <h3>Still have questions?</h3>

            <p>
              Our interior experts are ready to help you transform your dream
              home into reality.
            </p>

            <button>
              Book Free Consultation
            </button>

          </div> */}
        </div>
      </section>
    );
  }
}

export default FAQ;
