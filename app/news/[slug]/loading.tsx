import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function NewsDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Skeleton className="h-4 w-20 bg-purple-500/20" />
            <span className="mx-2 text-white/60">/</span>
            <Skeleton className="h-4 w-20 bg-purple-500/20" />
            <span className="mx-2 text-white/60">/</span>
            <Skeleton className="h-4 w-40 bg-purple-500/20" />
          </div>
        </div>
      </section>
      
      {/* News Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Skeleton className="h-6 w-40 mb-6 bg-purple-500/20" />
          
          <Skeleton className="h-6 w-24 mb-4 bg-purple-500/20" />
          
          <Skeleton className="h-12 w-full mb-3 bg-purple-500/20" />
          <Skeleton className="h-12 w-3/4 mb-6 bg-purple-500/20" />
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Skeleton className="h-5 w-32 bg-purple-500/20" />
            <Skeleton className="h-5 w-32 bg-purple-500/20" />
            <Skeleton className="h-5 w-32 bg-purple-500/20" />
            <Skeleton className="h-5 w-32 bg-purple-500/20" />
          </div>
          
          {/* Featured Image */}
          <Skeleton className="aspect-video w-full rounded-lg mb-12 bg-purple-500/20" />
        </div>
      </section>
      
      {/* News Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="md:col-span-9">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-3/4 bg-purple-500/20" />
                <Skeleton className="h-24 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-5/6 bg-purple-500/20" />
                <Skeleton className="h-24 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-full bg-purple-500/20" />
                <Skeleton className="h-6 w-2/3 bg-purple-500/20" />
              </div>
              
              {/* Tags */}
              <div className="mt-12">
                <Skeleton className="h-6 w-32 mb-4 bg-purple-500/20" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 bg-purple-500/20" />
                  <Skeleton className="h-6 w-24 bg-purple-500/20" />
                  <Skeleton className="h-6 w-16 bg-purple-500/20" />
                </div>
              </div>
              
              {/* Share */}
              <div className="mt-12">
                <Skeleton className="h-6 w-40 mb-4 bg-purple-500/20" />
                <div className="flex space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-purple-500/20" />
                  <Skeleton className="h-10 w-10 rounded-full bg-purple-500/20" />
                  <Skeleton className="h-10 w-10 rounded-full bg-purple-500/20" />
                  <Skeleton className="h-10 w-10 rounded-full bg-purple-500/20" />
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:col-span-3">
              {/* Author */}
              <Card className="bg-black/50 border-purple-500/30 mb-8">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="w-20 h-20 rounded-full mb-4 bg-purple-500/20" />
                    <Skeleton className="h-5 w-32 mb-1 bg-purple-500/20" />
                    <Skeleton className="h-4 w-16 bg-purple-500/20" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Categories */}
              <Card className="bg-black/50 border-purple-500/30 mb-8">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4 bg-purple-500/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full bg-purple-500/20" />
                    <Skeleton className="h-5 w-full bg-purple-500/20" />
                    <Skeleton className="h-5 w-full bg-purple-500/20" />
                    <Skeleton className="h-5 w-full bg-purple-500/20" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related News */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Separator className="bg-purple-500/30 mb-12" />
          <Skeleton className="h-8 w-48 mb-8 bg-purple-500/20" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-black/50 border-purple-500/30 h-full">
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-24 mb-3 bg-purple-500/20" />
                  <Skeleton className="h-6 w-full mb-2 bg-purple-500/20" />
                  <Skeleton className="h-6 w-3/4 mb-4 bg-purple-500/20" />
                  <Skeleton className="h-16 w-full mb-4 bg-purple-500/20" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24 bg-purple-500/20" />
                    <Skeleton className="h-4 w-16 bg-purple-500/20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}