import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { makeAnswer } from "../../../../../test/factories/make-answer"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { CommentOnAnswerUseCase } from "./comment-on-answer"
import { InMemoryAnswersCommentsRepository } from "../../../../../test/repositories/in-memory-answers-comment-repository"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository
let sut: CommentOnAnswerUseCase

describe("comment on a answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository()
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersCommentsRepository
    )
  })
  it("should create a comment on a answer successfully", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )
    inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: "user-x",
      answerId: newAnswer.id.toString(),
      content: "new comment",
    })

    expect(inMemoryAnswersCommentsRepository.items[0]?.content).toEqual(
      "new comment"
    )
  })
  it("should not be able to create a comment in a inexistent answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )
    inMemoryAnswersRepository.create(newAnswer)

    expect(async () => {
      return await sut.execute({
        authorId: "user-x",
        answerId: "answer-x",
        content: "new comment",
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
