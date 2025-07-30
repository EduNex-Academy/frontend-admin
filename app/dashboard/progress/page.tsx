"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockProgress, mockUsers, mockCourses } from "@/data/mock-data"

export default function ProgressPage() {
  const progressWithDetails = mockProgress.map((progress) => {
    const user = mockUsers.find((u) => u.id === progress.userId)
    const course = mockCourses.find((c) => c.id === progress.courseId)
    return { ...progress, user, course }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
        <p className="text-muted-foreground">Monitor student progress across all courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
          <CardDescription>Track individual student progress across courses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Last Accessed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressWithDetails.map((progress) => (
                <TableRow key={progress.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={progress.user?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{progress.user?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{progress.user?.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{progress.course?.title}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          {progress.completedLessons}/{progress.totalLessons} lessons
                        </span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <Progress value={progress.percentage} className="w-[100px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {Math.floor(progress.timeSpent / 60)}h {progress.timeSpent % 60}m
                  </TableCell>
                  <TableCell>{new Date(progress.lastAccessed).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
