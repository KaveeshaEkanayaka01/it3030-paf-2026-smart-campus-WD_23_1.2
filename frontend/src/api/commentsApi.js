import { apiRequest } from './httpClient'

export const commentsApi = {
  getTicketComments(ticketId) {
    return apiRequest(`/api/tickets/${ticketId}/comments`)
  },

  addComment(ticketId, message, createdBy) {
    return apiRequest(`/api/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        createdBy,
      }),
    })
  },

  updateComment(commentId, message, actorUserId, actorRole = 'USER') {
    return apiRequest(`/api/comments/${commentId}`, {
      method: 'PUT',
      query: { actorUserId, actorRole },
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
  },

  deleteComment(commentId, actorUserId, actorRole = 'USER') {
    return apiRequest(`/api/comments/${commentId}`, {
      method: 'DELETE',
      query: { actorUserId, actorRole },
    })
  },
}
