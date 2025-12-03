import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CourseCard } from "../Component/courses/CourseCard";
import { Input } from "../Component/ui/input";
import { Badge } from "../Component/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Component/ui/tabs";
import { courseAPI, enrollmentAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categories = ["All", "Mandatory", "Specialist", "Advanced", "Optional"];

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);

      console.log("Loading courses for role:", currentUser.role);

      const [coursesData, enrollmentsData] = await Promise.all([
        courseAPI.getAll(),
        enrollmentAPI.getUserEnrollments()
      ]);

      console.log("Courses received:", coursesData);
      console.log("Enrollments received:", enrollmentsData);

      setCourses(coursesData || []);
      setEnrollments(enrollmentsData || []);
    } catch (e) {
      console.error("Error loading courses:", e);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  // Match backend enrollment status values
  const normalizeStatus = (status) => {
    if (!status) return "NOT_STARTED";
    return status.toUpperCase();
  };

  const getEnrollment = (courseId) => {
    return enrollments.find((e) => e.course_id === courseId);
  };

  const filteredCourses = courses.filter((course) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(search) ||
      course.description.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "all" ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getFilteredByStatus = (status) => {
    return filteredCourses.filter((course) => {
      const enrollment = getEnrollment(course.id);
      const state = normalizeStatus(enrollment?.status);

      switch (status) {
        case "IN_PROGRESS":
          return state === "IN_PROGRESS";
        case "COMPLETED":
          return state === "COMPLETED";
        case "NOT_STARTED":
          return state === "NOT_STARTED";
        default:
          return true;
      }
    });
  };

  const handleStartCourse = async (course) => {
    try {
      const existing = getEnrollment(course.id);

      if (!existing) {
        await enrollmentAPI.enrollCourse(course.id);
      }

      const updatedEnrollments = await enrollmentAPI.getUserEnrollments();
      setEnrollments(updatedEnrollments || []);

      navigate(`/courses/${course.id}`);
    } catch (e) {
      console.error("Error starting course:", e);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p>Loading courses...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Training Courses</h1>
      <p className="text-muted-foreground">
        Your role: <strong>{currentUser.role}</strong>
      </p>

      {/* Search + Category */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={
                selectedCategory === cat.toLowerCase() ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className="cursor-pointer px-4 py-2"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredCourses.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({getFilteredByStatus("IN_PROGRESS").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({getFilteredByStatus("COMPLETED").length})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            Not Started ({getFilteredByStatus("NOT_STARTED").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <CourseGrid
            items={filteredCourses}
            getEnrollment={getEnrollment}
            handleStartCourse={handleStartCourse}
          />
        </TabsContent>

        <TabsContent value="in-progress">
          <CourseGrid
            items={getFilteredByStatus("IN_PROGRESS")}
            getEnrollment={getEnrollment}
            handleStartCourse={handleStartCourse}
          />
        </TabsContent>

        <TabsContent value="completed">
          <CourseGrid
            items={getFilteredByStatus("COMPLETED")}
            getEnrollment={getEnrollment}
            handleStartCourse={handleStartCourse}
          />
        </TabsContent>

        <TabsContent value="not-started">
          <CourseGrid
            items={getFilteredByStatus("NOT_STARTED")}
            getEnrollment={getEnrollment}
            handleStartCourse={handleStartCourse}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Reusable grid component
const CourseGrid = ({ items, getEnrollment, handleStartCourse }) => (
  <div>
    {items.length === 0 ? (
      <div className="text-center py-12 text-muted-foreground">
        No courses found.
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            enrollment={getEnrollment(course.id)}
            onStart={handleStartCourse}
            showProgress
          />
        ))}
      </div>
    )}
  </div>
);
