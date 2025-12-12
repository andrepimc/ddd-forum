import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { InMemoryQuestionsCommentsRepository } from "../../../../../test/repositories/in-memory-questions-comments-repository"
import { CommentOnQuestionUseCase } from "./comment-on-question"
import { makeQuestionComment } from "../../../../../test/factories/make-comment-question"
import { DeleteCommentQuestionUseCase } from "./delete-comment-question"

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteCommentQuestionUseCase

describe("delete a comment on a question", () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteCommentQuestionUseCase(inMemoryQuestionsCommentsRepository)
  })
  it("should delete a question comment", async () => {
    const newQuestion = makeQuestion()
    inMemoryQuestionsRepository.create(newQuestion)

    const questionComment = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: new UniqueEntityId("user-1"),
    })

    inMemoryQuestionsCommentsRepository.create(questionComment)

    await sut.execute({
      authorId: "user-1",
      questionCommentId: questionComment.id.toString(),
    })

    expect(inMemoryQuestionsCommentsRepository.items).toHaveLength(0)
  })
  it.skip("should not be able to delete a question comment not owned", async () => {
    const newQuestion = makeQuestion()
    inMemoryQuestionsRepository.create(newQuestion)

    const questionComment = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: new UniqueEntityId("user-1"),
    })

    inMemoryQuestionsCommentsRepository.create(questionComment)

    expect(async () => {
      return await sut.execute({
        authorId: "user-x",
        questionCommentId: questionComment.id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
