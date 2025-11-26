"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/admin/auth-guard"
import { getAllNews, createNews, updateNews, deleteNews, News } from "@/lib/firebase-admin"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Edit, Trash2, Loader2 } from "lucide-react"

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [formData, setFormData] = useState({ title: "", content: "" })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const news = await getAllNews()
      setNewsList(news)
    } catch (error) {
      console.error("Error fetching news:", error)
      alert("Failed to fetch news. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNews = () => {
    setFormData({ title: "", content: "" })
    setSelectedNews(null)
    setAddDialogOpen(true)
  }

  const handleEditNews = (news: News) => {
    setSelectedNews(news)
    setFormData({ title: news.title, content: news.content })
    setEditDialogOpen(true)
  }

  const handleDeleteNews = (news: News) => {
    setSelectedNews(news)
    setDeleteDialogOpen(true)
  }

  const handleSubmitAdd = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    try {
      setSubmitting(true)
      await createNews({
        title: formData.title.trim(),
        content: formData.content.trim(),
      })
      setAddDialogOpen(false)
      setFormData({ title: "", content: "" })
      fetchNews()
      alert("News created successfully!")
    } catch (error: any) {
      console.error("Error creating news:", error)
      alert(`Failed to create news: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitEdit = async () => {
    if (!selectedNews || !formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in both title and content")
      return
    }

    try {
      setSubmitting(true)
      await updateNews(selectedNews.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
      })
      setEditDialogOpen(false)
      setSelectedNews(null)
      setFormData({ title: "", content: "" })
      fetchNews()
      alert("News updated successfully!")
    } catch (error: any) {
      console.error("Error updating news:", error)
      alert(`Failed to update news: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedNews) return

    try {
      setSubmitting(true)
      await deleteNews(selectedNews.id)
      setDeleteDialogOpen(false)
      setSelectedNews(null)
      fetchNews()
      alert("News deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting news:", error)
      alert(`Failed to delete news: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return "N/A"
    try {
      const dateObj = date?.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
    } catch {
      return "N/A"
    }
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push("/admin")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">News Management</h1>
                <p className="text-gray-600">Manage and publish news articles</p>
              </div>
            </div>
            <Button onClick={handleAddNews}>
              <Plus className="mr-2 h-4 w-4" />
              Add News
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-800 mb-4" />
                <p className="text-gray-600">Loading news...</p>
              </div>
            </div>
          ) : newsList.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">No news articles found.</p>
              <Button onClick={handleAddNews}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First News Article
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {newsList.map((news) => (
                <Card key={news.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{news.title}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap mb-4">{news.content}</p>
                      <div className="text-sm text-gray-500">
                        <span>Created: {formatDate(news.createdAt)}</span>
                        {news.updatedAt && (
                          <span className="ml-4">Updated: {formatDate(news.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditNews(news)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteNews(news)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <Footer />

        {/* Add News Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New News</DialogTitle>
              <DialogDescription>
                Create a new news article. Fill in the title and content below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="add-title">Title</Label>
                <Input
                  id="add-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter news title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="add-content">Content</Label>
                <Textarea
                  id="add-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter news content"
                  className="mt-1 min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAdd} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create News"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit News Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit News</DialogTitle>
              <DialogDescription>
                Update the news article below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter news title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter news content"
                  className="mt-1 min-h-[200px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitEdit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update News"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete News</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this news article? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedNews && (
              <div className="py-4">
                <p className="font-semibold text-gray-900">{selectedNews.title}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{selectedNews.content}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </AuthGuard>
  )
}

