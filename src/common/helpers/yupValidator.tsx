import * as Yup from 'yup'

class Validator<T extends Yup.AnyObject> {
  private data: T
  private schema: Yup.ObjectSchema<T>

  constructor(data: T, schema: Yup.ObjectSchema<T>) {
    this.data = data
    this.schema = schema
  }

  async validate(): Promise<{ isValid: boolean; errors: object }> {
    try {
      await this.schema.validate(this.data, { abortEarly: false })
      return { isValid: true, errors: {} }
    } catch (err: any) {
      const errors: Record<string, string> = {}
      err.inner.forEach((error: any) => {
        errors[error.path] = error.message
      })
      return { isValid: false, errors: errors }
    }
  }
}

export default Validator
