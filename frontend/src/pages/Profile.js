import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Calendar, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Component/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../Component/ui/avatar';
import { Badge } from '../Component/ui/badge';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No user data found. Please log in again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Details</h1>
          <p className="text-muted-foreground mt-2">
            View your personal information and account details
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name || 'User Name'}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {user.email || 'user@example.com'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* General Details */}
        <Card>
          <CardHeader>
            <CardTitle>General Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Title
                </Label>
                <div className="text-base font-medium">
                  {user.title || 'Mr'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  First Name
                </Label>
                <div className="text-base font-medium">
                  {user.name?.split(' ')[0] || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Middle Name
                </Label>
                <div className="text-base font-medium">
                  {user.middleName || '-'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Surname
                </Label>
                <div className="text-base font-medium">
                  {user.name?.split(' ').slice(1).join(' ') || 'N/A'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date of Birth
                </Label>
                <div className="text-base font-medium">
                  {user.dob || '15/08/2000'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Role
                </Label>
                <div>
                  <Badge variant="secondary" className="font-medium">
                    {user.role || 'Carer'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <div className="text-base font-medium">
                  {user.email || 'user@example.com'}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Mobile
                </Label>
                <div className="text-base font-medium">
                  {user.mobile}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone
                </Label>
                <div className="text-base font-medium">
                  {user.phone}
                </div>
              </div>
            </div>


            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Line 1
                </Label>
                <div className="text-base font-medium">
                  {user.address1}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Line 2
                </Label>
                <div className="text-base font-medium">
                  {user.address2}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address Line 3
                </Label>
                <div className="text-base font-medium">
                  {user.address3 }
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Postcode
                </Label>
                <div className="text-base font-medium">
                  {user.postcode}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple Label component
const Label = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};
