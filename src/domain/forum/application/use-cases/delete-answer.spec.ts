import { expect, describe, beforeEach, it } from "vitest"

import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { DeleteAnswerUseCase } from "./delete-answer"
import { makeAnswer } from "../../../../../test/factories/make-answer"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe("delete a Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })
  it("should delete a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)
    await sut.execute({ id: "1", authorId: "1" })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
  })
  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId("1"),
      },
      new UniqueEntityId("1")
    )

    inMemoryAnswersRepository.create(newAnswer)

    expect(() => {
      return sut.execute({ id: "1", authorId: "2" })
    }).rejects.toBeInstanceOf(Error)
  })
})
