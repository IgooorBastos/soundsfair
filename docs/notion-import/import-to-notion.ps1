# ============================================
# Script PowerShell Interativo para Import no Notion
# ============================================

$Host.UI.RawUI.WindowTitle = "Notion Import Helper"

# Cores
$colors = @{
    Title = "Cyan"
    Step = "Green"
    Info = "Yellow"
    Success = "Green"
    Warning = "Red"
}

# Clear screen
Clear-Host

# ASCII Art
Write-Host @"
===============================================================

    NOTION IMPORT WIZARD
    Importar Documentacao do Projeto soundsfair

===============================================================
"@ -ForegroundColor $colors.Title

Write-Host ""
Start-Sleep -Seconds 1

# Verificar se os arquivos existem
$projectDir = "C:\Users\igor\projetos-claude\sites\ativos\bitcoin.com"
$files = @(
    "PROJECT_MANAGEMENT_TEMPLATE.md",
    "CHANGELOG.md",
    "IMPLEMENTATION_REPORT.md"
)

Write-Host "Verificando arquivos..." -ForegroundColor $colors.Step
Write-Host ""

$filesFound = @()
foreach ($file in $files) {
    $fullPath = Join-Path $projectDir $file
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        $sizeKB = [math]::Round($size / 1KB, 2)
        Write-Host "  [OK] $file ($sizeKB KB)" -ForegroundColor $colors.Success
        $filesFound += $file
    } else {
        Write-Host "  [X] $file (NAO ENCONTRADO)" -ForegroundColor $colors.Warning
    }
}

Write-Host ""
Write-Host "===============================================================" -ForegroundColor $colors.Title
Write-Host ""

# Menu interativo
Write-Host "Escolha uma opcao:" -ForegroundColor $colors.Info
Write-Host ""
Write-Host "  [1] Import Automatico (Abre Notion + Pasta)" -ForegroundColor Green
Write-Host "  [2] Ver Guia Passo a Passo" -ForegroundColor Yellow
Write-Host "  [3] Abrir Tutorial em Video" -ForegroundColor Cyan
Write-Host "  [4] Abrir Arquivo no Editor" -ForegroundColor Magenta
Write-Host "  [5] Sair" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Digite sua escolha (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando processo de import..." -ForegroundColor $colors.Step
        Write-Host ""

        # Passo 1: Abrir pasta
        Write-Host "[PASSO 1/4] Abrindo pasta com os arquivos..." -ForegroundColor $colors.Info
        Start-Process "explorer.exe" -ArgumentList $projectDir
        Start-Sleep -Seconds 2

        # Passo 2: Abrir Notion
        Write-Host "[PASSO 2/4] Abrindo Notion no navegador..." -ForegroundColor $colors.Info
        Start-Process "https://www.notion.so"
        Start-Sleep -Seconds 3

        # Passo 3: Mostrar instruções
        Write-Host ""
        Write-Host "===============================================================" -ForegroundColor $colors.Title
        Write-Host "  INSTRUCOES - SIGA ESTES PASSOS NO NOTION" -ForegroundColor $colors.Title
        Write-Host "===============================================================" -ForegroundColor $colors.Title
        Write-Host ""
        Write-Host "1. No Notion, clique no menu lateral esquerdo" -ForegroundColor Yellow
        Write-Host "2. Clique em 'Import' ou 'Importar'" -ForegroundColor Yellow
        Write-Host "3. Selecione 'Markdown & CSV'" -ForegroundColor Yellow
        Write-Host "4. Clique em 'Select files'" -ForegroundColor Yellow
        Write-Host "5. Na janela do Explorer (ja aberta):" -ForegroundColor Yellow
        Write-Host "     - Navegue ate a pasta que acabou de abrir" -ForegroundColor Gray
        Write-Host "     - Segure CTRL e clique nos arquivos .md" -ForegroundColor Gray
        Write-Host "     - Clique em 'Abrir'" -ForegroundColor Gray
        Write-Host "6. Clique em 'Import' para finalizar" -ForegroundColor Yellow
        Write-Host ""

        # Passo 4: Aguardar confirmação
        Write-Host "[PASSO 3/4] Arquivos prontos para import:" -ForegroundColor $colors.Info
        foreach ($file in $filesFound) {
            Write-Host "  > $file" -ForegroundColor Cyan
        }
        Write-Host ""

        $confirm = Read-Host "Pressione ENTER quando terminar o import no Notion"

        Write-Host ""
        Write-Host "Otimo! Verificando proximos passos..." -ForegroundColor $colors.Success
        Start-Sleep -Seconds 1

        # Passo 5: Próximos passos
        Write-Host ""
        Write-Host "===============================================================" -ForegroundColor $colors.Title
        Write-Host "  PROXIMOS PASSOS" -ForegroundColor $colors.Title
        Write-Host "===============================================================" -ForegroundColor $colors.Title
        Write-Host ""
        Write-Host "1. Organize as paginas em uma pasta 'Documentacao'" -ForegroundColor Green
        Write-Host "2. Favoritar a pagina PROJECT_MANAGEMENT_TEMPLATE" -ForegroundColor Green
        Write-Host "3. Converta tabelas em databases (clique -> Turn into database)" -ForegroundColor Green
        Write-Host "4. Compartilhe com seu time (botao Share)" -ForegroundColor Green
        Write-Host ""
        Write-Host "Consulte NOTION_IMPORT_GUIDE.md para mais detalhes!" -ForegroundColor Yellow
        Write-Host ""
    }

    "2" {
        Write-Host ""
        Write-Host "Abrindo guia completo..." -ForegroundColor $colors.Info
        $guidePath = Join-Path $projectDir "NOTION_IMPORT_GUIDE.md"
        Start-Process $guidePath
        Start-Sleep -Seconds 1
        Write-Host "Guia aberto no seu editor padrao!" -ForegroundColor $colors.Success
    }

    "3" {
        Write-Host ""
        Write-Host "Abrindo tutorial em video do Notion..." -ForegroundColor $colors.Info
        Start-Process "https://www.notion.so/help/import-data-into-notion"
        Start-Sleep -Seconds 1
        Write-Host "Tutorial aberto no navegador!" -ForegroundColor $colors.Success
    }

    "4" {
        Write-Host ""
        Write-Host "Qual arquivo deseja abrir?" -ForegroundColor $colors.Info
        Write-Host ""
        for ($i = 0; $i -lt $filesFound.Count; $i++) {
            Write-Host "  [$($i+1)] $($filesFound[$i])" -ForegroundColor Cyan
        }
        Write-Host ""
        $fileChoice = Read-Host "Digite o numero (1-$($filesFound.Count))"

        if ($fileChoice -ge 1 -and $fileChoice -le $filesFound.Count) {
            $selectedFile = $filesFound[$fileChoice - 1]
            $filePath = Join-Path $projectDir $selectedFile
            Write-Host ""
            Write-Host "Abrindo $selectedFile..." -ForegroundColor $colors.Info
            Start-Process $filePath
            Start-Sleep -Seconds 1
            Write-Host "Arquivo aberto!" -ForegroundColor $colors.Success
        } else {
            Write-Host "Opcao invalida!" -ForegroundColor $colors.Warning
        }
    }

    "5" {
        Write-Host ""
        Write-Host "Ate logo!" -ForegroundColor $colors.Info
        exit
    }

    default {
        Write-Host ""
        Write-Host "Opcao invalida! Execute o script novamente." -ForegroundColor $colors.Warning
    }
}

Write-Host ""
Write-Host "===============================================================" -ForegroundColor $colors.Title
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
