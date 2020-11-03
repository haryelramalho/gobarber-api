/**
 * Todas as conexões com libs externas que um dia podem mudar no nosso projeto
 * Devemos adiciona-las utilizando providers e injeção de dependência abstraindo sua lógica utilizando interfaces
 */

import './StorageProvider';
import './MailTemplateProvider';
import './MailProvider';
import './CacheProvider';
