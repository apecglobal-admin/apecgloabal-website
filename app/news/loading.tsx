import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Skeleton className="h-16 w-3/4 max-w-2xl mx-auto mb-6 bg-purple-500/20" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto mb-8 bg-purple-500/20" />
          <Skeleton className="h-12 w-full max-w-md mx-auto bg-purple-500/20" />
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-28 bg-purple-500/20" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-48 mb-8 bg-purple-500/20" />
          <Card className="bg-black/50 border-purple-500/30">
            <div className="grid md:grid-cols-2 gap-8">
              <Skeleton className="aspect-video bg-purple-500/20 rounded-lg" />
              <div className="p-8 space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-6 w-24 bg-purple-500/20" />
                  <Skeleton className="h-6 w-32 bg-purple-500/20" />
                </div>
                <Skeleton className="h-8 w-full bg-purple-500/20" />
                <Skeleton className="h-8 w-3/4 bg-purple-500/20" />
                <Skeleton className="h-24 w-full bg-purple-500/20" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-24 bg-purple-500/20" />
                    <Skeleton className="h-6 w-24 bg-purple-500/20" />
                    <Skeleton className="h-6 w-24 bg-purple-500/20" />
                  </div>
                  <Skeleton className="h-10 w-32 bg-purple-500/20" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-64 mb-8 bg-purple-500/20" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, index) => (
              <Card key={index} className="bg-black/50 border-purple-500/30">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-24 bg-purple-500/20" />
                    <Skeleton className="h-6 w-32 bg-purple-500/20" />
                  </div>
                  <Skeleton className="h-7 w-full bg-purple-500/20" />
                  <Skeleton className="h-7 w-3/4 mt-2 bg-purple-500/20" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-16 w-full bg-purple-500/20" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-20 bg-purple-500/20" />
                      <Skeleton className="h-4 w-20 bg-purple-500/20" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-purple-500/20" />
                  </div>
                  <Skeleton className="h-10 w-full bg-purple-500/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-black/50 border-purple-500/30 max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Skeleton className="h-8 w-48 mx-auto mb-2 bg-purple-500/20" />
              <Skeleton className="h-6 w-3/4 mx-auto bg-purple-500/20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 flex-1 bg-purple-500/20" />
                <Skeleton className="h-12 w-32 bg-purple-500/20" />
              </div>
              <Skeleton className="h-4 w-full max-w-md mx-auto bg-purple-500/20" />
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}