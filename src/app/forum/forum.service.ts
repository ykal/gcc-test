import { Injectable } from "@angular/core";
import { ApiService } from "../shared/services/api.service";
import { AuthService } from "../Auth/services/auth.service";

@Injectable()
export class ForumService {
  constructor(public apiService: ApiService, public authService: AuthService) {}

  createDiscussion(discussion) {
    return this.apiService.post(`Solveitdiscussions`, discussion);
  }

  togglePinDiscussion(discussion) {
    const update = discussion;
    update.pinned = !discussion.pinned;
    return this.apiService.put(`Solveitdiscussions/${discussion.id}`, update);
  }

  getMembers(forumId) {
    return this.apiService.get(`SolveITForums/${forumId}/members`);
  }

  getFavouriteDiscussions(userId) {
    return this.apiService.get(`UserAccounts/${userId}/favouriteDiscussions`);
  }

  getDiscussion(slung) {
    return this.apiService.get(
      `Solveitdiscussions/${slung}/discussion?filter={"include": "user"}`
    );
  }

  getDiscussionCount(forumId) {
    return this.apiService.get(`SolveITForums/${forumId}/discussions/count`);
  }

  countComments(discussionId) {
    return this.apiService.get(
      `Solveitdiscussions/${discussionId}/comments/count`
    );
  }

  updateDiscussion(discussion) {
    return this.apiService.patch(
      `Solveitdiscussions/${discussion.id}`,
      discussion
    );
  }

  getDiscussions(forumId) {
    return this.apiService.get(
      `SolveITForums/${forumId}/discussions?filter={"include": "user"}`
    );
  }

  getComments(discussionId) {
    return this.apiService.get(
      `Solveitdiscussions/${discussionId}/comments?filter={"include": "user"}`
    );
  }

  createForum(forum) {
    return this.apiService.post(`SolveITForums`, forum);
  }

  getForumList() {
    return this.apiService.get(`SolveITForums/forumList`);
  }

  getAllForumList() {
    return this.apiService.get(`SolveITForums?filter={"include": "category"}`);
  }

  getMyForumList(userId) {
    return this.apiService.get(
      `UserAccounts/${userId}/forums?filter={"include": "category"}`
    );
  }

  getForum(slung) {
    return this.apiService.get(`SolveITForums/${slung}/forum`);
  }

  getForumById(id) {
    return this.apiService.get(`SolveITForums/${id}`);
  }

  addComment(comment) {
    return this.apiService.post(`SolveIT-Discussion-Comments`, comment);
  }

  addMember(member) {
    return this.apiService.post(`forum_members`, member);
  }

  addToFavourites(favourite) {
    return this.apiService.post(`Favouritediscussions`, favourite);
  }

  removeFromFavorites(userId, discussionId) {
    return this.apiService.post(`Favouritediscussions/removeFromFavorite`, {
      userId,
      discussionId
    });
  }

  getCategories() {
    return this.apiService.get(`forumCategories`);
  }

  searchUser(keyword, userId) {
    return this.apiService.get(`UserAccounts/search/${keyword}/${userId}`);
  }

  blackList(content) {
    return this.apiService.post("BlackListedDiscussions", content);
  }

  removeFromBlackList(discussionId) {
    return this.apiService.post(
      "BlackListedDiscussions/removeFromBlackList",
      discussionId
    );
  }

  isUserBlackListedDiscussion(userId, discussionId) {
    return this.apiService.get(
      `Solveitdiscussions/${discussionId}/blackListed/${userId}`
    );
  }

  getCommentReplies(commentId) {
    return this.apiService.get(
      `SolveIT-Discussion-Comments/${commentId}/replies?filter={"include": "user"}`
    );
  }

  replyToComment(reply) {
    return this.apiService.post(`replies/`, reply);
  }

  getTags() {
    return this.apiService.get(`tags`);
  }

  addTagToDiscussion(discussionId, tagId) {
    return this.apiService.post(`taggedDiscussions`, {
      discussionId: discussionId,
      tagId: tagId
    });
  }

  getDiscussionTags(discussionId) {
    return this.apiService.get(`Solveitdiscussions/${discussionId}/tags`);
  }

  getBlacklistedDiscussions() {
    return this.apiService.get(
      `BlackListedDiscussions?filter={"include": "Solveitdiscussion"}`
    );
  }

  removeDiscussion(discussionId) {
    return this.apiService.delete(`Solveitdiscussions/${discussionId}`);
  }

  removeComment(commentId) {
    return this.apiService.delete(`SolveIT-Discussion-Comments/${commentId}`);
  }
  filterDiscussionByTag(tagId) {
    return this.apiService.get(`tags/${tagId}/discussions`);
  }
}
