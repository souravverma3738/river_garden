// src/pages/CoursePlayer.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../Component/ui/card";
import { Button } from "../Component/ui/button";
import { Progress } from "../Component/ui/progress";
import { courseAPI, enrollmentAPI } from "../services/api";

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasWatchedFully, setHasWatchedFully] = useState(false);

  // Load course and initial enrollment
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [courses, enrollments] = await Promise.all([
          courseAPI.getAll(),
          enrollmentAPI.getUserEnrollments(),
        ]);

        const c = courses.find((x) => String(x.id) === String(courseId));
        setCourse(c || null);

        const enrollment = enrollments.find((e) => e.course_id === Number(courseId));
        if (enrollment) {
          setProgress(enrollment.progress || 0);
          if (enrollment.progress >= 100 || enrollment.status === "completed") {
            setCompleted(true);
            setCanComplete(true);
            setHasWatchedFully(true);
          }
        }
      } catch (err) {
        console.error("Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  // Video event handlers
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;

    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    if (duration > 0) {
      const percentWatched = Math.floor((currentTime / duration) * 100);
      setVideoProgress(percentWatched);
    }
  };

  const handleVideoEnded = async () => {
    console.log("Video ended - enabling complete button");
    setHasWatchedFully(true);
    setCanComplete(true);
    setVideoProgress(100);

    // Auto-update progress to 100%
    if (!completed) {
      await saveProgress(100);
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Prevent video seeking (user must watch entire video)
  const handleSeeking = (e) => {
    if (!hasWatchedFully && videoRef.current) {
      // Only allow seeking if they've already watched the entire video once
      const currentTime = videoRef.current.currentTime;
      if (currentTime > videoRef.current.duration * 0.99) {
        // Allow if near the end
        return;
      }
      // Prevent seeking forward
      e.preventDefault();
      videoRef.current.currentTime = videoRef.current.currentTime - 0.1;
    }
  };

  // Save progress to backend
  const saveProgress = useCallback(
    async (newProgress) => {
      if (saving) return;
      try {
        setSaving(true);
        setProgress(newProgress);

        if (!navigator.onLine) {
          const key = `offline-progress-${courseId}`;
          localStorage.setItem(
            key,
            JSON.stringify({ courseId: Number(courseId), progress: newProgress })
          );
        } else {
          await enrollmentAPI.updateProgress(Number(courseId), newProgress);
        }
      } catch (err) {
        console.error("Error saving progress:", err);
      } finally {
        setSaving(false);
      }
    },
    [courseId, saving]
  );

  const handleCompleteCourse = async () => {
    if (!canComplete) {
      alert("Please watch the entire video before completing the course.");
      return;
    }

    try {
      await enrollmentAPI.completeCourse(Number(courseId));
      setCompleted(true);
      setProgress(100);
      alert("Congratulations! Course completed successfully!");
      navigate("/courses");
    } catch (err) {
      console.error("Error completing course:", err);
      alert("Error completing course. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-destructive">Course not found.</p>
      </div>
    );
  }

  if (!course.video_url) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-destructive">Video not available for this course.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </div>
          <div className="flex flex-col items-start md:items-end space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Course Progress</span>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="w-40 h-2" />
            {completed && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Course completed
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Video Player Card */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Video Progress: {videoProgress}%
            </span>
            {hasWatchedFully && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Video Player */}
            <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                data-testid="course-video-player"
                className="w-full aspect-video"
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={handleVideoEnded}
                onSeeking={handleSeeking}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controlsList="nodownload"
                disablePictureInPicture
              >
                <source src={course.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Custom Video Controls */}
            <div className="w-full max-w-4xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                  data-testid="play-pause-button"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMuteToggle}
                  data-testid="mute-button"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex-1">
                <Progress value={videoProgress} className="h-2" />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleFullscreen}
                data-testid="fullscreen-button"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Instructions */}
            {!hasWatchedFully && (
              <div className="w-full max-w-4xl p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ <strong>Important:</strong> You must watch the entire video to complete this course.
                  The "Complete Course" button will be enabled once you finish watching.
                </p>
              </div>
            )}

            {/* Complete Course Button */}
            <div className="w-full max-w-4xl">
              <Button
                onClick={handleCompleteCourse}
                disabled={!canComplete || completed}
                className="w-full"
                size="lg"
                data-testid="complete-course-button"
                variant={completed ? "outline" : "default"}
              >
                {completed ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Course Completed
                  </>
                ) : canComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Complete Course
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5 opacity-50" />
                    Complete Course (Watch video to enable)
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
