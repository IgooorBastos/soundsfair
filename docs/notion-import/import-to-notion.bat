@echo off
REM ============================================
REM Script para Importar Arquivos para o Notion
REM ============================================

echo.
echo ========================================
echo  IMPORTAR PARA NOTION - Tutorial Passo a Passo
echo ========================================
echo.

REM Define o diretório do projeto
set PROJECT_DIR=C:\Users\igor\projetos-claude\sites\ativos\bitcoin.com

echo [PASSO 1] Abrindo pasta com os arquivos...
echo.
explorer "%PROJECT_DIR%"
timeout /t 2 /nobreak >nul

echo.
echo [PASSO 2] Arquivos disponiveis para importar:
echo.
echo   1. PROJECT_MANAGEMENT_TEMPLATE.md  (Template completo de gerenciamento)
echo   2. CHANGELOG.md                    (Historico de mudancas)
echo   3. IMPLEMENTATION_REPORT.md        (Relatorio de implementacao)
echo.

echo [PASSO 3] Abrindo Notion no navegador...
echo.
start https://www.notion.so

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  INSTRUCOES PARA IMPORTAR
echo ========================================
echo.
echo No Notion que acabou de abrir:
echo.
echo 1. Clique no menu lateral esquerdo (tres tracinhos)
echo 2. Clique em "Import" ou "Importar"
echo 3. Selecione "Markdown & CSV"
echo 4. Clique em "Select files" ou "Selecionar arquivos"
echo 5. Na janela que abriu (Windows Explorer):
echo    - Navegue ate: %PROJECT_DIR%
echo    - Selecione os arquivos .md que deseja importar
echo    - Clique em "Abrir"
echo 6. Clique em "Import" para finalizar
echo.
echo ========================================
echo  DICA PRO
echo ========================================
echo.
echo Voce pode selecionar multiplos arquivos segurando CTRL
echo e clicando em cada arquivo .md que deseja importar!
echo.
echo Arquivos recomendados para importar primeiro:
echo   - PROJECT_MANAGEMENT_TEMPLATE.md (PRINCIPAL)
echo   - CHANGELOG.md
echo   - IMPLEMENTATION_REPORT.md
echo.

echo Pressione qualquer tecla para abrir um tutorial em video...
pause >nul

echo.
echo [EXTRA] Abrindo tutorial em video do Notion...
start https://www.notion.so/help/import-data-into-notion

echo.
echo Script concluido! Boa sorte com a importacao.
echo.
pause
