import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Mail, Phone, MapPin } from "lucide-react";

export default function LegalPages() {
  const { page } = useParams<{ page: string }>();

  const getPageContent = () => {
    switch (page) {
      case "privacy":
        return {
          title: "Privacy Policy",
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Information We Collect
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  BookingWithCal collects information to provide better services
                  to our users. We collect information in the following ways:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>
                    <strong>Information you give us:</strong> Account
                    information, business details, and booking data
                  </li>
                  <li>
                    <strong>Information we get from your use:</strong> Usage
                    analytics and performance metrics
                  </li>
                  <li>
                    <strong>Customer information:</strong> Booking details and
                    contact information provided by customers
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  How We Use Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process bookings and send notifications</li>
                  <li>Communicate with you about your account</li>
                  <li>Protect against fraud and abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Information Security
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We work hard to protect BookingWithCal and our users from
                  unauthorized access, alteration, disclosure, or destruction of
                  information we hold. We use encryption, secure servers, and
                  regular security audits to maintain the security of your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We retain your information for as long as necessary to provide
                  our services and as required by law. You can request deletion
                  of your account and associated data at any time.
                </p>
              </section>
            </div>
          ),
        };

      case "terms":
        return {
          title: "Terms of Service",
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Acceptance of Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing and using BookingWithCal, you accept and agree to
                  be bound by the terms and provision of this agreement. If you
                  do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Service Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  BookingWithCal is a multi-tenant booking platform that allows
                  businesses to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Create custom booking pages for their clients</li>
                  <li>Manage appointments and schedules</li>
                  <li>Send automated notifications</li>
                  <li>Access analytics and reporting tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  User Responsibilities
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  As a user of BookingWithCal, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use the service in compliance with applicable laws</li>
                  <li>Respect the privacy and rights of your customers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Limitation of Liability
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  BookingWithCal shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, or
                  other intangible losses resulting from your use of the
                  service.
                </p>
              </section>
            </div>
          ),
        };

      case "contact":
        return {
          title: "Contact Us",
          content: (
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-300">
                We're here to help! Get in touch with our support team for any
                questions or assistance you need.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-blue-600" />
                      Email Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      For general inquiries and support:
                    </p>
                    <a
                      href="mailto:support@bookingwithcal.com"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      support@bookingwithcal.com
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      Response time: Within 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-green-600" />
                      Phone Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      For urgent technical issues:
                    </p>
                    <a
                      href="tel:+15551234567"
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      +1 (555) 123-4567
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      Available: Mon-Fri, 9AM-6PM EST
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                    Business Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <address className="text-gray-600 dark:text-gray-300 not-italic">
                    BookingWithCal Inc.
                    <br />
                    123 Business Street
                    <br />
                    Suite 100
                    <br />
                    San Francisco, CA 94105
                    <br />
                    United States
                  </address>
                </CardContent>
              </Card>

              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      How do I reset my password?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Use the "Forgot Password" link on the login page or
                      contact support for assistance.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Can I customize my booking page?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Yes! You can customize colors, logos, and content through
                      your business dashboard.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      Is there a mobile app?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      BookingWithCal is fully responsive and works great on
                      mobile browsers. Native apps are in development.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          ),
        };

      default:
        return {
          title: "Page Not Found",
          content: (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Legal page not found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The requested legal page could not be found.
              </p>
              <Link to="/">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          ),
        };
    }
  };

  const { title, content } = getPageContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-primary mr-2" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                BookingWithCal
              </span>
            </div>
          </div>

          {/* Content */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none">
              {content}
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/legal/privacy">
                <Button variant="ghost" size="sm">
                  Privacy Policy
                </Button>
              </Link>
              <Link to="/legal/terms">
                <Button variant="ghost" size="sm">
                  Terms of Service
                </Button>
              </Link>
              <Link to="/legal/contact">
                <Button variant="ghost" size="sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
