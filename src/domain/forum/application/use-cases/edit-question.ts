import { Q } from "@faker-js/faker/dist/airline-DF6RqYmq"
import type { QuestionsRepository } from "../repositories/questions-repository"
import { Question } from "../../enterprise/entities/question"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { Either, left, right } from "../../../../core/either"
import { NotAllowedError } from "./errors/not-allowed-error"
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository"
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list"
import { QuestionAttachment } from "../../enterprise/entities/question-attachment"
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id"

interface EditQuestionUseCaseRequest {
  id: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}
  async execute({
    id,
    authorId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(id)

    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments
    )

    const newQuestionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      })
    })

    questionAttachmentsList.update(newQuestionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentsList

    await this.questionsRepository.save(question)

    return right({ question })
  }
}
