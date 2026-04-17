import { apiRequest } from './httpClient'

export const commentsApi = {
  getTicketComments(ticketId) {
    return apiRequest(`/api/tickets/${ticketId}/comments`)
  },

  addComment(ticketId, content) {
    return apiRequest(`/api/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
      }),
    })
  },

  updateComment(commentId, content) {
    return apiRequest(`/api/tickets/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
  },

  deleteComment(commentId) {
    return apiRequest(`/api/tickets/comments/${commentId}`, {
      method: 'DELETE',
    })
  },
}
