import React from 'react';
import { AlertCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export const TeamMemberCard = ({ member, onViewDetails }) => {
  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-success';
    if (rate >= 75) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div>
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Compliance</span>
                <span className={`font-semibold ${getComplianceColor(member.completionRate)}`}>
                  {member.completionRate}%
                </span>
              </div>
              <Progress value={member.completionRate} className="h-2" />
            </div>

            <div className="flex items-center space-x-2">
              {member.overdueCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  {member.overdueCount} Overdue
                </Badge>
              )}
              {member.expiringCount > 0 && (
                <Badge variant="warning" className="text-xs">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {member.expiringCount} Expiring
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onViewDetails(member)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};