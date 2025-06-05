import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Calendar, MessageSquare, CreditCard, Star, CheckCircle, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Connect with Skilled Professionals in Your Area
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-50">
                Find reliable electricians, plumbers, carpenters, and more for your home or business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/select-role" className="btn bg-white text-primary-600 hover:bg-primary-50">
                  Get Started
                </Link>
                <Link to="/services" className="btn bg-transparent border-2 border-white hover:bg-primary-400">
                  Explore Services
                </Link>
              </div>
            </div>
            <div className="relative fade-in hidden md:block">
              <div className="bg-white rounded-lg shadow-xl p-6 transform rotate-3">
                <div className="flex items-start mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Electrician" 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-neutral-900 font-semibold text-lg">Raj Kumar</h3>
                    <p className="text-neutral-600">Electrician</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            className={`${star <= 4 ? 'text-warning-500' : 'text-neutral-300'}`} 
                            fill={star <= 4 ? '#FDB528' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-neutral-600">4.0 (48 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3 text-neutral-700">
                  <p>Services: Electrical repairs, wiring, installation</p>
                  <p>Experience: 8 years</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge-primary">Available Now</span>
                  <button className="btn-primary py-1 px-3 text-sm">Book Now</button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-xl p-6 absolute top-16 right-0 transform -rotate-2">
                <div className="flex items-start mb-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Plumber" 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-neutral-900 font-semibold text-lg">Priya Singh</h3>
                    <p className="text-neutral-600">Plumber</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={16} 
                            className={`${star <= 5 ? 'text-warning-500' : 'text-neutral-300'}`} 
                            fill={star <= 5 ? '#FDB528' : 'none'}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-neutral-600">5.0 (62 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mb-3 text-neutral-700">
                  <p>Services: Pipe repairs, installations, drainage</p>
                  <p>Experience: 6 years</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge-success">Verified ✓</span>
                  <button className="btn-primary py-1 px-3 text-sm">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How SkillLink Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Our platform makes it easy to find, book, and pay skilled professionals for your projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Search className="w-10 h-10 text-primary-500" />,
                title: 'Search',
                description: 'Find skilled workers based on your requirements, location, and availability.'
              },
              {
                icon: <Calendar className="w-10 h-10 text-primary-500" />,
                title: 'Book',
                description: 'Schedule appointments with professionals at your preferred time and location.'
              },
              {
                icon: <MessageSquare className="w-10 h-10 text-primary-500" />,
                title: 'Connect',
                description: 'Chat directly with professionals to discuss your requirements in detail.'
              },
              {
                icon: <CreditCard className="w-10 h-10 text-primary-500" />,
                title: 'Pay',
                description: 'Securely pay for services through multiple payment options.'
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              We connect you with professionals across a wide range of services for all your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Electrical Services',
                description: 'Expert electricians for repairs, installations, and maintenance.',
                image: 'https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg?auto=compress&cs=tinysrgb&w=600'
              },
              {
                title: 'Plumbing',
                description: 'Professional plumbers for all your pipe, fixture, and drainage needs.',
                image: 'https://images.pexels.com/photos/5257489/pexels-photo-5257489.jpeg?auto=compress&cs=tinysrgb&w=600'
              },
              {
                title: 'Carpentry',
                description: 'Skilled carpenters for furniture, repairs, and woodwork projects.',
                image: 'https://images.pexels.com/photos/3637786/pexels-photo-3637786.jpeg?auto=compress&cs=tinysrgb&w=600'
              },
              {
                title: 'Painting',
                description: 'Transform your space with our professional painting services.',
                image: 'https://images.pexels.com/photos/6474343/pexels-photo-6474343.jpeg?auto=compress&cs=tinysrgb&w=600'
              },
              {
                title: 'Cleaning',
                description: 'Thorough home and office cleaning services for a spotless environment.',
                image: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=600'
              },
              {
                title: 'Appliance Repair',
                description: 'Quick and reliable repairs for all your household appliances.',
                image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=600'
              },
            ].map((service, index) => (
              <div key={index} className="card group hover:shadow-md transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-neutral-600 mb-4">{service.description}</p>
                  <Link 
                    to="/select-role" 
                    className="flex items-center text-primary-500 font-medium hover:text-primary-600"
                  >
                    Find a professional
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose SkillLink?</h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <CheckCircle className="w-6 h-6 text-success-500" />,
                    title: 'Verified Professionals',
                    description: 'All workers are verified through ID checks and qualification validation.'
                  },
                  {
                    icon: <Star className="w-6 h-6 text-warning-500" />,
                    title: 'Reviewed & Rated',
                    description: 'See genuine ratings and reviews from other customers before booking.'
                  },
                  {
                    icon: <Shield className="w-6 h-6 text-primary-500" />,
                    title: 'Secure Payments',
                    description: 'Pay securely through our platform with multiple payment options.'
                  },
                  {
                    icon: <MessageSquare className="w-6 h-6 text-secondary-500" />,
                    title: 'Direct Communication',
                    description: 'Chat directly with professionals to explain your requirements.'
                  },
                ].map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 mt-1">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <p className="text-neutral-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/8297452/pexels-photo-8297452.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Service provider helping client" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center mb-2">
                  <Star fill="#FDB528" className="w-5 h-5 text-warning-500" />
                  <Star fill="#FDB528" className="w-5 h-5 text-warning-500" />
                  <Star fill="#FDB528" className="w-5 h-5 text-warning-500" />
                  <Star fill="#FDB528" className="w-5 h-5 text-warning-500" />
                  <Star fill="#FDB528" className="w-5 h-5 text-warning-500" />
                </div>
                <p className="text-neutral-700 text-sm">
                  "The electrician from SkillLink fixed my complex wiring issue within an hour. Professional, 
                  on-time, and reasonably priced. Highly recommended!"
                </p>
                <div className="mt-2 text-neutral-600 text-sm">
                  - Ananya Patel, Mumbai
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Don't just take our word for it - here's what our users have to say about their experience with SkillLink.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finding reliable plumbers used to be a nightmare until I discovered SkillLink. The booking process was smooth, and the plumber arrived on time and fixed our leaking pipe quickly.",
                author: "Vikram Mehta",
                role: "Homeowner",
                image: "https://randomuser.me/api/portraits/men/72.jpg"
              },
              {
                quote: "As a carpenter, SkillLink has helped me connect with clients in my area and grow my business. The verification process gives clients confidence, and the booking system is straightforward.",
                author: "Sanjay Gupta",
                role: "Professional Carpenter",
                image: "https://randomuser.me/api/portraits/men/36.jpg"
              },
              {
                quote: "Our office needed urgent electrical repairs, and within an hour of using SkillLink, we had a qualified electrician at our door. The service quality and platform ease are exceptional.",
                author: "Neha Sharma",
                role: "Business Owner",
                image: "https://randomuser.me/api/portraits/women/65.jpg"
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={18} 
                        className="text-warning-500" 
                        fill="#FDB528"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-secondary-600 to-secondary-500 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have found reliable skilled professionals through SkillLink.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/select-role" className="btn bg-white text-secondary-600 hover:bg-secondary-50">
              Sign Up Now
            </Link>
            <Link to="/services" className="btn bg-transparent border-2 border-white hover:bg-secondary-400">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;