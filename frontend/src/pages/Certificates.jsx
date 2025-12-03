import React, { useState, useEffect } from 'react';
import { Download, Award } from 'lucide-react';
import { CertificateView } from '../Component/certificates/CertificateView';
import { Button } from '../Component/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../Component/ui/alert';
import { certificateAPI } from '../services/api';

export const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await certificateAPI.getUserCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground mt-2">
            View and download your training certificates
          </p>
        </div>
        {certificates.length > 0 && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        )}
      </div>

      {/* Info Alert */}
      {certificates.length > 0 && (
        <Alert variant="success">
          <Award className="h-4 w-4" />
          <AlertTitle>Great job!</AlertTitle>
          <AlertDescription>
            You have {certificates.length} active certificate{certificates.length !== 1 ? 's' : ''}. Keep up the excellent work!
          </AlertDescription>
        </Alert>
      )}

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {certificates.map(certificate => (
            <CertificateView key={certificate.id} certificate={certificate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No certificates yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete your training courses to earn certificates
          </p>
          <Button onClick={() => window.location.href = '/courses'}>Browse Courses</Button>
        </div>
      )}
    </div>
  );
};