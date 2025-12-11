import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { InMemoryQuestionsCommentsRepository } from "../../../../../test/repositories/in-memory-questions-comments-repository"
import { CommentOnQuestionUseCase } from "./comment-on-question"
import { makeQuestionComment } from "../../../../../test/factories/make-comment-question"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let sut: CommentOnQuestionUseCase

describe("comment on a question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsCommentsRepository
    )
  })
  it("should create a comment on a question successfully", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )
    inMemoryQuestionsRepository.create(newQuestion)

    await sut.execute({
      authorId: "user-x",
      questionId: newQuestion.id.toString(),
      content: "new comment",
    })

    expect(inMemoryQuestionsCommentsRepository.items[0]?.content).toEqual(
      "new comment"
    )
  })
  it.skip("should not be able to create a comment in a inexistent question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )
    inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      return await sut.execute({
        authorId: "user-x",
        questionId: "question-x",
        content: "new comment",
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
