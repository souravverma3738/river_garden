// src/pages/CoursePlayer.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import { ArrowLeft, ZoomIn, ZoomOut, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../Component/ui/card";
import { Button } from "../Component/ui/button";
import { Progress } from "../Component/ui/progress";
import { courseAPI, enrollmentAPI } from "../services/api";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  const pdfFile =  "/med-leaflet.pdf"; // served from public folder

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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const calcProgressFromPage = useCallback(
    (page) => {
      if (!numPages) return progress;
      const value = Math.round((page / numPages) * 100);
      return value > 100 ? 100 : value;
    },
    [numPages, progress]
  );

  // Save progress to backend (debounced-ish)
  const saveProgress = useCallback(
    async (newProgress) => {
      if (saving) return;
      try {
        setSaving(true);
        if (!navigator.onLine) {
          // offline: store for later
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

  const handlePageChange = async (newPage) => {
    if (!numPages) return;
    if (newPage < 1 || newPage > numPages) return;
    setPageNumber(newPage);

    const newProgress = calcProgressFromPage(newPage);
    if (newProgress > progress) {
      setProgress(newProgress);
      await saveProgress(newProgress);
      if (newProgress >= 100 && !completed) {
        setCompleted(true);
        await enrollmentAPI.completeCourse(Number(courseId));
      }
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.8));

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
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="w-40 h-2" />
            {completed && (
              <div className="flex items-center text-sm text-success">
                <CheckCircle className="h-4 w-4 mr-1" />
                Course completed
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Viewer + Controls */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pageNumber} {numPages ? `of ${numPages}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {(scale * 100).toFixed(0)}%
            </span>
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center">
            <div className="border rounded-lg overflow-hidden bg-muted">
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="p-8 text-center text-muted-foreground">
                    Loading PDF...
                  </div>
                }
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            </div>

            {/* Pagination */}
            {numPages && (
              <div className="flex items-center justify-between w-full mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageNumber <= 1}
                  onClick={() => handlePageChange(pageNumber - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pageNumber >= numPages}
                  onClick={() => handlePageChange(pageNumber + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
