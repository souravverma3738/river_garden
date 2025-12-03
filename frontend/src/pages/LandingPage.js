import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Award, Users, TrendingUp, Shield, Smartphone, FileCheck, PlayCircle, Star } from 'lucide-react';
import { Button } from '../Component/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Badge } from '../Component/ui/badge';

export const LandingPage = () => {
  const features = [
    {
      icon: Award,
      title: 'Instant Certification',
      description: 'Automatic certificate generation with QR code verification upon course completion',
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Learning',
      description: 'Access training anytime, anywhere with our responsive mobile-friendly platform',
    },
    {
      icon: Shield,
      title: 'CQC Compliant',
      description: 'Fully compliant with CQC and Skills for Care training requirements',
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Track team compliance, expiring certificates, and training progress instantly',
    },
    {
      icon: Clock,
      title: 'Smart Reminders',
      description: 'Automated email and SMS notifications for upcoming and overdue training',
    },
    {
      icon: FileCheck,
      title: 'Audit-Ready Reports',
      description: 'One-click export of compliance reports for CQC inspections and audits',
    },
  ];

  const benefits = [
    'Reduce admin time by 75% with automated training management',
    '100% visibility of staff compliance status',
    'Instant certification with digital signatures',
    'Mobile access for carers on the go',
    'Automated reminders eliminate manual follow-ups',
    'GDPR compliant with secure data storage',
  ];

  const testimonials = [
    {
      name: 'Emma Thompson',
      role: 'Care Manager, London West',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      content: 'River Garden Training has transformed how we manage compliance. What used to take days now takes minutes.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Team Leader, Manchester',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      content: 'The mobile app is perfect for our carers. They can complete training during their breaks.',
      rating: 5,
    },
    {
      name: 'Sarah Johnson',
      role: 'Support Worker',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      content: 'I love how easy it is to track my progress and download my certificates instantly.',
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <Badge className="w-fit" variant="secondary">
                CQC Compliant Training Platform
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Empower Your{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Care Team
                </span>{' '}
                with Modern Training
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Streamline compliance, automate certification, and deliver exceptional training for UK home care professionals. Reduce admin time by 75% and ensure 100% CQC readiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="xl" variant="premium" className="w-full sm:w-auto">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Start Free Trial
                  </Button>
                </Link>
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <div className="text-sm text-muted-foreground">Certificates Issued</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/32213307/pexels-photo-32213307.jpeg"
                alt="Healthcare professionals in training"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Everything You Need for Training Excellence
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for UK home care providers to meet CQC requirements and streamline operations
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our intuitive platform
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your organization account and add team members' },
              { step: '02', title: 'Assign Courses', description: 'Automatically assign mandatory training based on roles' },
              { step: '03', title: 'Complete Training', description: 'Staff complete courses at their own pace with quizzes' },
              { step: '04', title: 'Get Certified', description: 'Instant certificate generation with QR verification' },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-6">
                Why Care Providers Choose Us
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/login">
                  <Button size="lg" variant="premium">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86"
                alt="Data analytics dashboard"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Trusted by Care Professionals</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl mb-6">
            Ready to Transform Your Training?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Join thousands of UK care professionals using River Garden Training to ensure compliance and deliver exceptional care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="xl" variant="outline" className="bg-white text-primary hover:bg-white/90 border-0">
                Start Free Trial
              </Button>
            </Link>
            <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};