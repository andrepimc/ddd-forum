import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { InMemoryQuestionsCommentsRepository } from "../../../../../test/repositories/in-memory-questions-comments-repository"
import { CommentOnQuestionUseCase } from "./comment-on-question"
import { makeQuestionComment } from "../../../../../test/factories/make-comment-question"
import { DeleteCommentQuestionUseCase } from "./delete-comment-question"
import { ListQuestionCommentsUseCase } from "./list-question-comments"

let inMemoryQuestionsCommentsRepository: InMemoryQuestionsCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ListQuestionCommentsUseCase

describe("list comments on a question", () => {
  beforeEach(() => {
    inMemoryQuestionsCommentsRepository =
      new InMemoryQuestionsCommentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ListQuestionCommentsUseCase(inMemoryQuestionsCommentsRepository)
  })
  it("should list all question comments", async () => {
    const newQuestion = makeQuestion()
    inMemoryQuestionsRepository.create(newQuestion)

    const questionComment1 = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: new UniqueEntityId("user-1"),
    })
    const questionComment2 = makeQuestionComment({
      questionId: newQuestion.id,
      authorId: new UniqueEntityId("user-2"),
    })

    inMemoryQuestionsCommentsRepository.create(questionComment1)
    inMemoryQuestionsCommentsRepository.create(questionComment2)

    await sut.execute({
      questionId: newQuestion.id.toString(),
    })

    expect(inMemoryQuestionsCommentsRepository.items).toHaveLength(2)
  })
})
