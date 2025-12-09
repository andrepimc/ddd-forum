import { expect, describe, beforeEach, it } from "vitest"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { EditAnswerUseCase } from "./edit-answer"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { makeAnswer } from "../../../../../test/factories/make-answer"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe("edit an Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })
  it("should save an Answer correctly", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      id: "1",
      authorId: "1",
      content: "Nova resposta",
    })

    expect(inMemoryAnswersRepository.items[0]?.content).toEqual("Nova resposta")
  })
  it("should not be able to edit an Answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)

    expect(() => {
      return sut.execute({
        id: "1",
        authorId: "2",
        content: "Nova resposta",
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
