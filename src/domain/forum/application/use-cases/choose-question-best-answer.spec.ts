import { expect, describe, beforeEach, it } from "vitest"
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository"
import { makeQuestion } from "../../../../../test/factories/make-question"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"
import { EditQuestionUseCase } from "./edit-question"
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository"
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer"
import { makeAnswer } from "../../../../../test/factories/make-answer"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe("choose a best Answer for a Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    )
  })
  it("should save a best answer for a question correctly", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )
    inMemoryQuestionsRepository.create(newQuestion)

    const newAnswerForQuestion = makeAnswer(
      {
        authorId: new UniqueEntityId("user-2"),
        questionId: newQuestion.id,
      },
      new UniqueEntityId("best-answer-id")
    )

    inMemoryAnswersRepository.create(newAnswerForQuestion)

    await sut.execute({
      authorId: "user-1",
      answerId: "best-answer-id",
    })

    expect(inMemoryQuestionsRepository.items[0]?.bestAnswerId).toEqual(
      new UniqueEntityId("best-answer-id")
    )
  })
  it("should not be able to choose a best answer for a question if u are not the author of the question", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId("user-1"),
      },
      new UniqueEntityId("1")
    )
    inMemoryQuestionsRepository.create(newQuestion)

    const newAnswerForQuestion = makeAnswer(
      {
        authorId: new UniqueEntityId("user-2"),
        questionId: newQuestion.id,
      },
      new UniqueEntityId("best-answer-id")
    )

    inMemoryAnswersRepository.create(newAnswerForQuestion)

    expect(async () => {
      return await sut.execute({
        authorId: "user-x",
        answerId: "best-answer-id",
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
