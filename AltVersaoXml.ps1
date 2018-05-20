[CmdletBinding()]
Param(
   [Parameter(Mandatory=$True,Position=0,HelpMessage="path do arquivo de configuracao")]
   [string]$configfile,
   
   [Parameter(Mandatory=$True,Position=1,HelpMessage="numero build")]
   [string]$numerobuild
)

function Modify-VersionFile($configfile, $numerobuild) 
{

    try 
    {
        $option = [System.StringSplitOptions]::RemoveEmptyEntries
        $separador = '='
        $dicParam = @{}
        $dicParamString = @{}
        $doc = New-Object System.Xml.XmlDocument
         
        Write-Host 'Verificando a existencia do arquivo de configuracao' $configfile 
        if(Test-Path $configfile)
        {
              Write-Host 'Lendo o arquivo de configuracao e carregando em memoria'
              $doc.Load($configfile) 
              $node = $doc.SelectSingleNode('parametros/numerobuild')
              if($node)
              {
                 Write-Host "Atualizando o numero de Build" $numerobuild 
                 $node.InnerText = $numerobuild 
              }
              $node = $doc.SelectSingleNode('parametros/datahoraexecucao')
              if($node)
              {
                $node.InnerText = [System.DateTime]::Now.ToString("yyyy-MM-dd HH:mm:ss") 
              }
   
              Write-Host ""
              Write-Host 'Atualizando os valores modificados no arquivo fisico' $configfile
              $doc.Save($configfile)
              Write-Host 'Procedimento concluido arquivo atualizado'
              Exit 0
            
        }
        else 
        {
            Write-Host 'Arquivo de configuracao nao encontrado' $configfile
            Exit 1 
            return 
        }
         
    }
    catch [Exception]
    {
        Write-Host 'ERRO NA EXECUCAO DO SCRIPT:' $_.Exception.Message
        exit 1 
        return 
    }
}

 Write-Host "Arquivo de configuracao: " $configfile
 Write-Host "Parametro Numero Build: " $numerobuild
 Write-Host ""
 Modify-VersionFile $configfile $numerobuild