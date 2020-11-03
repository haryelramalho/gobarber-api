import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({
    file,
    variables,
  }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    // Compila o texto e retorna uma função
    const parseTemplate = handlebars.compile(templateFileContent);

    // Adiciona as variáveis
    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
