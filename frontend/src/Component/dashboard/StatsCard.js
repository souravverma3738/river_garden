import React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

export const StatsCard = ({ icon: Icon, title, value, subtitle, trend, className }) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {subtitle && (
                <span className="text-sm text-muted-foreground">/ {subtitle}</span>
              )}
            </div>
            {trend && (
              <p className={cn(
                'text-xs font-medium',
                trend.positive ? 'text-success' : 'text-destructive'
              )}>
                {trend.value} {trend.label}
              </p>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};