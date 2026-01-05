import { expect, describe, beforeEach, it } from "vitest"
import { AnswerQuestionUseCase } from "./answer-question"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "../../../../../test/repositories/in-memory-answer-attachments-repository"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: AnswerQuestionUseCase

describe("create an answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      instructorId: "1",
      questionId: "1",
      content: "Nova resposta",
      attachmentsIds: [],
    })
    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
  })
})
