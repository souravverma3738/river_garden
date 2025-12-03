import React from 'react';
import { Award, Download, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDate, getExpiryStatus, daysUntilExpiry } from '../../lib/utils';

export const CertificateView = ({ certificate }) => {
  const expiryStatus = getExpiryStatus(certificate.expiryDate);
  const daysLeft = daysUntilExpiry(certificate.expiryDate);

  const getExpiryBadge = () => {
    if (expiryStatus === 'expired') {
      return <Badge variant="destructive">Expired</Badge>;
    } else if (expiryStatus === 'critical') {
      return <Badge variant="destructive">Expires in {daysLeft} days</Badge>;
    } else if (expiryStatus === 'warning') {
      return <Badge variant="warning">Expires in {daysLeft} days</Badge>;
    }
    return <Badge variant="success">Valid</Badge>;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-primary/20 p-3">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{certificate.courseName}</h3>
                <p className="text-sm text-muted-foreground">Certificate of Completion</p>
              </div>
            </div>
            {getExpiryBadge()}
          </div>

          {/* Certificate Body */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center space-x-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Awarded to {certificate.userName}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Certificate ID</p>
                <p className="font-mono font-medium">{certificate.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Score</p>
                <p className="font-medium">{certificate.score}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Issue Date</p>
                <p className="font-medium">{formatDate(certificate.issueDate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{formatDate(certificate.expiryDate)}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Scan to verify</p>
                <img src={certificate.qrCode} alt="QR Code" className="h-20 w-20" />
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};