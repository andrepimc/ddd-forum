import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { makeAnswerComment } from "../../../../../test/factories/make-comment-answer"
import { InMemoryAnswersCommentsRepository } from "../../../../../test/repositories/in-memory-answers-comment-repository"
import { ListAnswerCommentsUseCase } from "./list-answer-comment"

let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ListAnswerCommentsUseCase

describe("list comments on a answer", () => {
  beforeEach(() => {
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ListAnswerCommentsUseCase(inMemoryAnswersCommentsRepository)
  })
  it("should list all answer comments", async () => {
    const newAnswer = makeAnswer()
    inMemoryAnswersRepository.create(newAnswer)

    const answerComment1 = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: new UniqueEntityId("user-1"),
    })
    const answerComment2 = makeAnswerComment({
      answerId: newAnswer.id,
      authorId: new UniqueEntityId("user-2"),
    })

    inMemoryAnswersCommentsRepository.create(answerComment1)
    inMemoryAnswersCommentsRepository.create(answerComment2)

    await sut.execute({
      answerId: newAnswer.id.toString(),
    })

    expect(inMemoryAnswersCommentsRepository.items).toHaveLength(2)
  })
})
