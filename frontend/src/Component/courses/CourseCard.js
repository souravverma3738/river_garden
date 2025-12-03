import React from 'react';
import { Clock, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export const CourseCard = ({ course, enrollment, onStart, showProgress = false }) => {
  const getStatusBadge = () => {
    if (!enrollment) return <Badge variant="outline">Not Started</Badge>;

    switch (enrollment.status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getDifficultyColor = () => {
    switch (course.difficulty) {
      case 'Beginner':
        return 'text-success';
      case 'Intermediate':
        return 'text-warning';
      case 'Advanced':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary">{course.category}</Badge>
        </div>
      </div>

      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2 text-xl">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Course Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className={`h-4 w-4 ${getDifficultyColor()}`} />
            <span className={getDifficultyColor()}>{course.difficulty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4" />
            <span>{course.modules} modules</span>
          </div>
        </div>

        {/* Progress */}
        {showProgress && enrollment && enrollment.progress > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{enrollment.progress}%</span>
            </div>
            <Progress value={enrollment.progress} className="h-2" />
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          variant={enrollment?.status === 'completed' ? 'outline' : 'default'}
          onClick={() => onStart(course)}
        >
          {enrollment?.status === 'completed'
            ? 'View Certificate'
            : enrollment?.status === 'in-progress'
            ? 'Continue Learning'
            : 'Start Course'}
        </Button>
      </CardFooter>
    </Card>
  );
};
