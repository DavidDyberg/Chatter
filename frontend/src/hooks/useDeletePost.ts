import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '@/api-routes/posts'
import toast from 'react-hot-toast'

export const useDeletePost = (profileId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),

    onSuccess: () => {
      toast.success('Post deleted successfully')

      queryClient.invalidateQueries({ queryKey: ['posts'] })

      if (profileId) {
        queryClient.invalidateQueries({ queryKey: ['user', profileId] })
      }
    },

    onError: () => {
      toast.error('Something went wrong when deleting post, try again later')
    },
  })
}
